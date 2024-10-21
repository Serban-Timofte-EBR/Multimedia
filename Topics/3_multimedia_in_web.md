## Multimedia in context Web

- HTML5 ofera suport imbunatati prin elemente audio, video, canvas

### Limbajul JavaScript

- Limbaj dinamic, orientat obiect
- Utlizat pentru:

&emsp;&emsp;&emsp; - Manipularea obiectelor DOM

&emsp;&emsp;&emsp; - Evenimente

&emsp;&emsp;&emsp; - Procesare

&emsp;&emsp;&emsp; - Remote communication

**Integrare JS in HTML**

1. Fisier extern:

```javascript
<script type = "text/javascript" scr = "path/to/file"></script>
```

2. In cadrul paginii:

```javascript
<script>
    let test = 10;
</script>
```

**Tipuri de date in JS**

1. Tipuri de baza

&emsp;&emsp;&emsp; - Number (-3.14, 6 ,2)

&emsp;&emsp;&emsp; - Boolean (true, false)

&emsp;&emsp;&emsp; - String ("Hello, World!", "test")

&emsp;&emsp;&emsp; - null / undefined

&emsp;&emsp;&emsp; - Object 

```javascript
{
    nume: "Ana",
    varsta: 7
}
```

2. Obiecte speciale

&emsp;&emsp;&emsp; - Function: function f() {...}

&emsp;&emsp;&emsp; - Array: [1,2,"trei"]

**Variabile si expresii**

1. Declare:

```javascript
    a = 8
    b = false
```

```javascript
    var a = 8
    let b = "test"
    const c = "test"
    // c = 3 // Error

    const v = [1,2,3]
    v[0] = 5    // works fine
```

**Scope**

1. Global vs Local / Function vs block based

&emsp;&emsp;&emsp; - Let este block scope (daca declar o variabila intr-un bloc cu let NU este accesibila in afara blocului)

```javascript
    {
        let a = 10;
        var b = 15;
    }

    console.log(a)  // let este block scope
    console.log(b)

    sayHello(); // works fine

    function sayHello() {
        console.log("Hello, World!")
    }
```

**Array**

```javascript
   var v = []

   var v2 = [1,2,3]
   
   var vMix = [1, "Ion"]
```

**Functions**

```javascript
   function suma(a, b) {
    return a+b;
   }

    function sumaDefault2(a, b = 2) {
     return a+b;
   }

   var sumaVar = function(a,b) {
    return a+b;
   }

   var test = function(val) {return val + 1;}(5);   // call with params
```

**Obiecte**

<code>Un obiect este o colectie de proprietati</code> (cheie : valoare)

```javascript
   // Literali
   var ob = {
    nume: "Ana",
    varsta: 7
   }

   // new
    let ob2 = new Object()

    // Citire
    var v = ob.varsta
    v = ob["varsta"]
    for v in obj {
        ...
    }

    ob.varsta = 8
    ob["varsta"] = 8

    // Adaugare
    ob.test = function() {console.log("test")}

    ob.afisare = function() {console.log("Nume: " + this.nume)}

    // Apelare
    ob.afisare();
```

**Constructori si mostenire**

- Functiile JS pot fi utilizate pentru construirea de obiecte

```javascript
   function Persoana(nume) {
        this.nume = nume;
        this.varsta = 1;
   }

   // Apel
   let ob2 = new Persoana("Maria")
```

### Document Object Model (DOM)

- Fiecare obiect este derivat din <i>**Node**</i>

- Radacina: document.documentElement

- Nodurile au proprietati specifice in functie de tag-ul HTML

**Nodurile Web**

```javascript
   elem = document.getElementById("id_cautat");

   elem2 = element.querySelector("selector")
   lista = element.querySelector2("selector")

   // Mai avem si: getElementsByClassName, getElementsByTagName
```

**Manipularea nodurilor**

```javascript
    // Crearea unui nod
   elem = document.createElement("tag HTML")

   // Accesare atribute
   elem.numeAtribut // accesarea valorii unui atribut
   elem.attributes  // colectie de atribute
   elem.style.numeAtributCss    // accesarea de atribute CSS
```

**Tratarea evenimentelor**

```javascript
    <button type"submit" onSubmit="handleSubmit()">Submit</button>

    let elementSelectat = document.getElementById("test")
    elementSelectat.onClick = function() {
        console.log("test");
    }

    // Prin eventListener
    document.getElementById("test")
        .addEvenetListener(
            "click",
            function sayHello() {
                console.log("Hello, World!");
            }
        )
```

**Programarea executiei functiei**

1. Executata o singura data dupa un interval de timp stabilit

```javascript
    var id = setTimeout(functie, durata[param1, param2, ...])

    setTimeout(() => console.log("Timeout"), 10);

    // Oprire
    clearTimeout()
```

2. Executie repetata la un interval stabilit

```javascript
    var id = setInterval(functie, durata[param1, param2, ...])

    setInterval(() => console.log("Interval"), 10);

    // Oprire 
    clearInterval()
```