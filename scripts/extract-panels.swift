// Splits the printed tri-fold brochure into the five panels the site shows.
//
//   swift scripts/extract-panels.swift <brochure.pdf> <outDir> [panelWidthPx]
//
// Each PDF page is one side of the sheet and holds three panels; the blank
// middle panel of the outer sheet is skipped. Needs nothing but macOS.

import Foundation
import AppKit
import PDFKit

let args = CommandLine.arguments
guard args.count >= 3 else {
    print("usage: swift extract-panels.swift <brochure.pdf> <outDir> [panelWidthPx]")
    exit(2)
}
let inPath = args[1]
let outDir = args[2]
let targetW = CGFloat(args.count > 3 ? (Double(args[3]) ?? 1200) : 1200)

guard let doc = PDFDocument(url: URL(fileURLWithPath: inPath)) else {
    print("ERROR: cannot open \(inPath)")
    exit(1)
}

/// (pdf page index, panel index within that page, output name)
let plan: [(page: Int, panel: Int, name: String)] = [
    (0, 2, "01-cover"),
    (1, 0, "02-our-camp"),
    (1, 1, "03-experience"),
    (1, 2, "04-location"),
    (0, 0, "05-back"),
]

for step in plan {
    guard let page = doc.page(at: step.page) else {
        print("skipped \(step.name): no page \(step.page)")
        continue
    }

    let bounds = page.bounds(for: .mediaBox)
    let panelWidth = bounds.width / 3
    let scale = targetW / panelWidth
    let w = Int(targetW.rounded())
    let h = Int((bounds.height * scale).rounded())

    guard
        let rep = NSBitmapImageRep(
            bitmapDataPlanes: nil, pixelsWide: w, pixelsHigh: h,
            bitsPerSample: 8, samplesPerPixel: 4, hasAlpha: true, isPlanar: false,
            colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0),
        let ctx = NSGraphicsContext(bitmapImageRep: rep)
    else { continue }

    NSGraphicsContext.saveGraphicsState()
    NSGraphicsContext.current = ctx
    let cg = ctx.cgContext
    cg.setFillColor(CGColor(red: 1, green: 1, blue: 1, alpha: 1))
    cg.fill(CGRect(x: 0, y: 0, width: CGFloat(w), height: CGFloat(h)))
    cg.scaleBy(x: scale, y: scale)
    // move the wanted panel to x = 0
    cg.translateBy(x: -(bounds.minX + panelWidth * CGFloat(step.panel)), y: -bounds.minY)
    page.draw(with: .mediaBox, to: cg)
    NSGraphicsContext.restoreGraphicsState()

    guard let png = rep.representation(using: .png, properties: [:]) else { continue }
    let out = URL(fileURLWithPath: "\(outDir)/\(step.name).png")
    try png.write(to: out)
    print("\(step.name): \(w)x\(h)px  → \(out.path)")
}
