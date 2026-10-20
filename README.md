# Olon Khond Tourist Camp — брошур вэб

Хэвлэмэл брошурыг (3 нугалаат, 2 талтай PDF) утсанд зориулсан **нэг хуудас вэб** болгосон.
Нийт **5 дэлгэц**, зөвхөн **хажуу тийш swipe**, дээш-доош гүйлгэлт байхгүй.

## Юу хаана байгаа

| Файл | Үүрэг |
| --- | --- |
| [app/page.tsx](app/page.tsx) | 5 слайдын жагсаалт (зураг, нэр, alt текст) |
| [app/Deck.tsx](app/Deck.tsx) | Swipe-ийн логик, цэгүүд, гар/сумны удирдлага |
| [app/deck.module.css](app/deck.module.css) | Шилжилтийн эффект, байршил |
| [public/slides/](public/slides) | Брошурын 5 хэсэг (JPEG, 1200×2546) |
| [scripts/extract-panels.swift](scripts/extract-panels.swift) | PDF-ээс хэсгүүдийг дахин гаргах скрипт |

## Хэрхэн ажилладаг

Брошур бол 3 нугалаат — тал бүр нь 3 хэсэг, нийт 6 хэсэг. Гадна талын **дундах хэсэг
цулгай хоосон** учраас түүнийг оруулаагүй, үлдсэн 5 нь дарааллаараа:

1. Нүүр — _Discover the Soul of the Gobi_
2. _Our Camp_
3. _Experience the Gobi_ / _About Olon Khond_
4. _Location_ / _Contact Us_
5. _Wide Nature, Warm Hospitality_ + QR

Хэсэг бүрийн харьцаа 1200:2546 (≈0.47) буюу утасны дэлгэцтэй бараг яг таардаг тул
бүтэн дэлгэцээр, юу ч таслахгүй харагдана. Дэлгэцийн харьцаа өөр байвал үлдсэн зайг
тухайн хуудасны бүдгэрүүлсэн хувилбар дүүргэнэ.

Шилжилт: CSS scroll-snap дээр суурилсан (iOS дээр жам ёсны swipe мэдрэмжтэй), дээр нь
гүйлгэх явцад 3D эргэлт, parallax, масштаб, бараантуулалт нэмсэн.

## Локал дээр ажиллуулах

```bash
npm install && npm run dev
```

## Vercel дээр гаргах

```bash
npx vercel@latest --prod
```

Эсвэл GitHub-аар дамжуулан: кодоо push хийгээд [vercel.com/new](https://vercel.com/new)
дээрээс репог import хийнэ. Тохиргоо өөрчлөх шаардлагагүй — Next.js-ийг автоматаар таних ба
бүх хуудас статикаар урьдчилан бэлтгэгдэнэ.

Өөрийн домэйн холбосон бол OG зураг зөв ажиллахын тулд Vercel дээр энэ орчны хувьсагчийг нэмнэ:

```bash
NEXT_PUBLIC_SITE_URL=https://таны-домэйн.mn
```

## Брошур өөрчлөгдвөл

PDF шинэчлэгдсэн үед хэсгүүдийг дахин гаргана (macOS, нэмэлт програм шаардахгүй):

```bash
swift scripts/extract-panels.swift "Брошур Англи хэлээр.pdf" ./out 1200
```

Дараа нь `out/*.png`-г JPEG болгож `public/slides/` дотор тавина:

```bash
for f in out/*.png; do sips -s format jpeg -s formatOptions 88 "$f" --out "public/slides/$(basename "$f" .png).jpg"; done
```

Хуудасны дараалал эсвэл тоо өөрчлөгдвөл [app/page.tsx](app/page.tsx) доторх `slides`
жагсаалтыг засна.
