## Grafica Vectoriala

În cazul graficii vectoriale computerului i se oferă un set de comenzi pe care le
execută pentru a desena imaginea. Imaginile conțin căi (en: paths) compuse din
puncte, linii, curbe și forme (en: shapes).

```html
<svg viewBox="0 0 220 100" xmlns="http://www.w3.org/2000/svg">
<!-- Simple rectangle -->
<rect width="100" height="100" />
<!-- Rounded corner rectangle -->
<rect x="120" width="100" height="100" rx="15" />
</svg>
```

Output: 

<svg viewBox="0 0 220 100" xmlns="http://www.w3.org/2000/svg">
<!-- Simple rectangle -->
<rect width="100" height="100" />
<!-- Rounded corner rectangle -->
<rect x="120" width="100" height="100" rx="15" />
</svg>

- Deoarece căile (en: paths) pot fi redimensionate matematic, imaginile vectoriale
pot fi redimensionate, fără a se pierde din claritatea imaginii.

## Formatul SVG

- format de imagine vectorială bazat pe XML pentru grafică bidimensională

```html
<!DOCTYPE html>
<html>
<body>
    <svg width="400" height="180">
        <rect x="50" y="20" width="150" height="150" style="fill:red;stroke:black;stroke-width:5;opacity:0.5">
    </svg>
</body>
```