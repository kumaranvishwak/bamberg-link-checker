# Bamberg Link Checker

A small TypeScript app that validates a URL while typing and checks it against mocked server data.

## Run

```
npm install
npm run dev
npm test
npm run build
```

## Try it

- `https://uni-bamberg.example/lectures/isosysc/` — folder
- `https://uni-bamberg.example/lectures/isosysc/slides-week3.pdf` — file
- `https://uni-bamberg.example/mensa/` — not found

These URLs are part of the mock data. The app does not check real websites.
Server checks start at most once every 700 ms while typing.

## References

- [MDN: URL() constructor](https://developer.mozilla.org/en-US/docs/Web/API/URL/URL)
- [MDN: setTimeout()](https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout)