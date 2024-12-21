const quizData = {

    //Die Fragen wurden teilweise mithilfe von ChatGPT erstellt
    "Mathematik": [
        {
            "f": "\\int_{0}^{2} x^2 \,dx",
            "l": ["\\frac{8}{3}", "\\frac{4}{3}", "\\frac{2}{3}", "\\frac{1}{3}"]
        },
        {
            "f": "\\lim_{x \\to 0} \\frac{\\sin(x)}{x}",
            "l": ["1", "0", "-1", "\\infty"]
        },
        {
            "f": "\\frac{d}{dx} \\ln(x^2)",
            "l": ["\\frac{2}{x}", "x", "\\ln(x)", "2x"]
        },
        {
            "f": "\\int x^3 \,dx",
            "l": ["\\frac{1}{4}x^4 + C", "\\frac{1}{2}x^2 + C", "x + C", "\\ln(x) + C"]
        },
        {
            "f": "\\sum_{n=1}^{5} n",
            "l": ["15", "10", "20", "25"]
        },
        {
            "f": "\\sqrt{16}",
            "l": ["4", "8", "2", "6"]
        },
        {
            "f": "\\int_{1}^{2} 2x \,dx",
            "l": ["3", "2", "1", "4"]
        },
        {
            "f": "\\lim_{x \\to \\infty} \\frac{1}{x}",
            "l": ["0", "1", "\\infty", "-\\infty"]
        }
    ],

    "Internettechnologien": [
        {
            "f": "Welcher HTTP-Statuscode steht für 'Nicht gefunden'?",
            "l": ["404", "200", "500", "301"]
        },
        {
            "f": "Was bedeutet die Abkürzung 'CSS'?",
            "l": ["Cascading Style Sheets", "Creative Style Sheets", "Computer Style Sheets", "Colorful Style Sheets"]
        },
        {
            "f": "Welches Symbol wird verwendet, um eine Klasse in CSS zu kennzeichnen?",
            "l": [".", "#", "!", "&"]
        },
        {
            "f": "Was ist die Dateiendung für eine JavaScript-Datei?",
            "l": [".js", ".html", ".css", ".php"]
        },
        {
            "f": "Welches Protokoll wird für die sichere Übertragung von Webseiten verwendet?",
            "l": ["HTTPS", "SSH", "FTP", "SMTP"]
        },
        {
            "f": "Welches HTML-Element wird verwendet, um einen Absatz zu erstellen?",
            "l": ["<p>", "<div>", "<a>", "<span>"]
        },
        {
            "f": "Welches HTML-Element wird verwendet, um eine Tabelle zu erstellen?",
            "l": ["<table>", "<div>", "<span>", "<ul>"]
        },
        {
            "f": "Was ist die Funktion von AJAX?",
            "l": ["Daten asynchron laden", "HTML-Inhalte stylen", "JavaScript ausführen", "CSS laden"]
        }
    ],

    "Allgemeinwissen": [
        {
            "f": "Wer schrieb 'Die Leiden des jungen Werthers'?",
            "l": ["Johann Wolfgang von Goethe", "Friedrich Schiller", "Heinrich Heine", "Thomas Mann"]
        },
        {
            "f": "Was ist die chemische Formel von Kohlendioxid?",
            "l": ["CO2", "H2O", "NaCl", "CH4"]
        },
        {
            "f": "Wie viel Felder hat ein Schachbrett?",
            "l": ["64", "49", "56", "72"]
        },
        {
            "f": "Wie heiß der fünfte Bundeskanzler der BRD?",
            "l": ["Helmut Schmidt", "Willy Brandt", "Helmut Kohl", "Kurt Georg Kiesinger"]
        },
        {
            "f": "Was ist die Hauptstadt von Australien?",
            "l": ["Canberra", "Sydney", "Melbourne", "Wellington"]
        },
        {
            "f": "Welcher Planet ist als roter Planet bekannt?",
            "l": ["Mars", "Venus", "Erde", "Jupiter"]
        },
        {
            "f": "Wer war der zweite Mensch auf dem Mond?",
            "l": ["Buzz Aldrin", "Lance Armstrong", "Yuri Gagarin", "Michael Collins"]
        },
        {
            "f": "Wer gilt als 'Vater der Wasserstoffbombe'?",
            "l": ["Edward Teller", "J. Robert Oppenheimer", "Leó Szilárd", "Enrico Fermi"]
        }
    ],

    
};

//Deklarieren der HTML-Elemente
const radioButtons = document.querySelectorAll('input[name="kategorie"]');
const answerButtons = document.querySelectorAll(".answer-btn");
const frageContainer = document.getElementById("frage");
const buttonContainer = document.getElementById("answers");
const statistikContainer = document.getElementById("statistik");
const progressCount = document.getElementById("progress-count");
const progressBar = document.getElementById("progressBar");

//Deklarieren globaler Variablen
let runde = 0;
let frage_index, akt_Frage, kategorie, quizID, serverAntwort;
let gestellte_fragen = [];
let gestServIndex = [];
let gespielteKategorien = [];
let gewerteteAntworten = [];
let richtigeProKategorie = [];

const FRAGEN_PRO_RUNDE = 5;

//Erstellen eines EventListeners für jeden der RadioButtons
radioButtons.forEach(radio => {
    radio.addEventListener("change", () => {
        kategorie = radio.value;
        neuesSpiel(); //Wird ein RadioButton ausgewählt, wird ein neues "Spiel" gestartet
    });
});

//Erstellen eines EventListeners für jeden der AntwortButtons
answerButtons.forEach((button, index) => {
    button.addEventListener("click", () => {

        //Je nach ausgewählter Kategorie wird gehandelt: Hier werden die Antworten auf Richtigkeit überprüft
        if (kategorie == 'Zufallsfragen') {

            löseFrage(button);
            deaktiviereButtons();

        } else {

            const auswahl = button.textContent;
            const richte_lsg = quizData[kategorie][frage_index].l[0]; //Die erste Lösung ist immer die richtige
            if (auswahl.includes(richte_lsg)) {
                button.style.backgroundColor = "green";
                gewerteteAntworten.push(true);
            } else {
                button.style.backgroundColor = "red";
                gewerteteAntworten.push(false);
            }
            deaktiviereButtons();            
        }  
        
        updateProgressBar();
        setTimeout(starteRunde, 1500);   //Nach 1.5 Sekunden wird automatisch die nächste Runde begonnen
    });
});

function deaktiviereButtons () {
    answerButtons.forEach(button => {
        button.disabled = true;
    });
}

//Die Funktion bekommt ein Array, verändert die Positionen der Elemente und gibt es wieder zurück
function mischeLösungen(array) {
    const benutzte_index = [];
    const new_array = [];
    let j;
    for (let i = 0; i < array.length; i++) {
        do {
            j = Math.floor(Math.random() * array.length);
        } while (benutzte_index.includes(j));
        benutzte_index.push(j);
        new_array[i] = array[j];
    };
    return new_array;
}

function zeigeFrage() {

    //Die Fragen werden je nach Kategorie auf unterschiedliche Art angezeigt
    if (kategorie == 'Mathematik') {
        
        //Hier wird eine zufällige Frage ausgewählt und in einem Array gespeichert
        do {
            frage_index = Math.floor(Math.random() * quizData[kategorie].length);
            akt_Frage = quizData[kategorie][frage_index];
        } 
        while (gestellte_fragen.includes(akt_Frage.f));
        gestellte_fragen.push(akt_Frage.f);

        //Aufgabe wird mittels katex im div-Element "frage" angezeigt 
        katex.render(akt_Frage.f, frage, {displayMode: true});

        //Antwortmöglichkeiten werden gemischt und dann auf den AntwortButtons angezeigt
        const gemischt_l = mischeLösungen(akt_Frage.l);
        answerButtons.forEach((button, index) => {
            katex.render(gemischt_l[index], button, {displayMode: true});
            button.style.backgroundColor = "";
            button.disabled = false;
        });
    } else if (kategorie == 'Zufallsfragen') {
        holeFrage();        
    } 

      else {

        //Hier wird eine zufällige Frage ausgewählt und in einem Array gespeichert
        do {
            frage_index = Math.floor(Math.random() * quizData[kategorie].length);
            akt_Frage = quizData[kategorie][frage_index];
        } 
        while (gestellte_fragen.includes(akt_Frage.f));
        gestellte_fragen.push(akt_Frage.f);

        //Frage wird angezeigt
        frageContainer.textContent = akt_Frage.f;

        //Antwortmöglichkeiten werden gemischt und dann auf den AntwortButtons angezeigt
        const gemischt_l = mischeLösungen(akt_Frage.l);
        answerButtons.forEach((button, index) => {
            button.textContent = gemischt_l[index];
            button.style.backgroundColor = "";
            button.disabled = false;
        });
    }
    //Updaten der Rundenanzeige
    progressCount.textContent = (runde) + "/" + FRAGEN_PRO_RUNDE;
}

let num = 0;
function starteRunde() {
    if (runde < FRAGEN_PRO_RUNDE) {
        runde+=1;
        zeigeFrage();
    } else {
        let richtigeAntworten = 0;
        //Überprüfen, wie viele richtige in dieser Kategorie (Teil der Auswertung)
        for (num; num < gewerteteAntworten.length; num++) {
            if (gewerteteAntworten[num]) {
                richtigeAntworten += 1;
            }
        }
        richtigeProKategorie.push(richtigeAntworten);
        zeigeStatistik();
    }
}

function updateProgressBar() {

    if (window.matchMedia("(max-width: 800px)").matches) {
        progressBar.style.width = runde*(100/FRAGEN_PRO_RUNDE) + '%';
        progressBar.style.height = '100%';
      } else {
        progressBar.style.height = runde*(100/FRAGEN_PRO_RUNDE) + '%';
        progressBar.style.width = '100%';
      }
}

//Funktion zum Holen der Frage vom Server
function holeFrage(event)  {
    
    //Überprüfung, ob die Frage schon gestellt wurde
    do {
        quizID = Math.floor(Math.random() * 31) + 2; //ID 2-33
    } while (gestServIndex.includes(quizID));
    gestServIndex.push(quizID);

    //Antwort-Buttons leeren, weil bei Fehlermeldung sieht es sonst nicht schön aus
    answerButtons.forEach(button => {
        button.innerHTML = "";
        button.style.backgroundColor = "";
    });

    let xhr = getXhr();
    sendXhr(xhr);

    function xhrHandler() {
        console.log("Status: " + xhr.readyState);
        if (xhr.readyState != 4) {
            return;
        }
        console.log("Status: " + xhr.readyState + " " + xhr.status);
        if (xhr.status == 200) {
            console.log(xhr.responseText);
            akt_Frage = JSON.parse(xhr.responseText); //globale Variabel akt_Frage wird neu zugewiesen

            //Frage anzeigen
            frageContainer.textContent = akt_Frage.text;
            gestellte_fragen.push(akt_Frage.text);

            //Antwortmöglichkeiten mischen und auf den Buttons anzeigen
            const gemischt_l = mischeLösungen(akt_Frage.options);
            answerButtons.forEach((button, index) => {
            button.textContent = gemischt_l[index] 
            button.style.backgroundColor = "";
            button.disabled = false;
            });
        }
    }

    function getXhr() {
        if (window.XMLHttpRequest) {
            let xhr = new XMLHttpRequest();
            return xhr;
        } else return false;
    }

    function sendXhr(xhr) {
        xhr.onreadystatechange = xhrHandler;
        xhr.open('GET', 'https://idefix.informatik.htw-dresden.de:8888/api/quizzes/'+quizID);
        xhr.setRequestHeader('Authorization', 'Basic ' + btoa('s85959@htw-dresden.de:xxxx'));

        // Setze Timeout auf 2 Sekunden
        xhr.timeout = 2000; // in Millisekunden
        
        // Event-Handler für Timeout
        xhr.ontimeout = function () {
            frageContainer.innerHTML = "Fehler!<br>Die Verbindung zum Server ist fehlgeschlagen.<br>Für die Kategorie 'Zufallsfragen' musst<br> du im Netz der HTW Dresden sein.<br><br>Bitte wähle eine andere Kategorie aus.";

            //Entferne Zufallsfragen aus gespiele Kategorien
            gespielteKategorien.pop();
            xhr.abort(); // Abbrechen der Anfrage
            setTimeout(zeigeStatistik, 5000);
        };

        xhr.send(null);
        console.log("Request send");
    }
}

//Funktion zum überprüfen der Antwort der Lösung
function löseFrage(button) {
    
    let antIndex = akt_Frage.options.indexOf(button.textContent);

    let xhr = getXhr();
    sendXhr(xhr);

    function xhrHandler() {
        console.log("Status: " + xhr.readyState);
        if (xhr.readyState != 4) {
            return;
        }
        console.log("Statuts: " + xhr.readyState + " " + xhr.status);
        if (xhr.status == 200) {
            console.log(xhr.responseText);
            serverAntwort = JSON.parse(xhr.responseText);
            if (serverAntwort.success) {
                button.style.backgroundColor = "green";
                gewerteteAntworten.push(true);
            } else {
                button.style.backgroundColor = "red";
                gewerteteAntworten.push(false);
            }
        }
    }

    function getXhr() {
        if (window.XMLHttpRequest) {
            let xhr = new XMLHttpRequest();
            return xhr;
        } else return false;
    }

    function sendXhr(xhr) {
        xhr.onreadystatechange = xhrHandler;
        xhr.open('POST', 'https://idefix.informatik.htw-dresden.de:8888/api/quizzes/'+quizID+'/solve');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Authorization', 'Basic ' + btoa('s85959@htw-dresden.de:xxxx'));
        let data = '['+antIndex+']';
        xhr.send(data);
        console.log("Request send");
    }
}

function neuesSpiel() {

    runde = 0;
    buttonContainer.style.display = "grid";
    statistikContainer.style.display = "none";   

    //Vermerken, dass Kategorie nun gespielt wird / wurde
    gespielteKategorien.push(kategorie);

    //RadioButtons werden gesperrt, da man nicht die Kategorie wechseln soll, bevor alle 5 Fragen beantwortet wurden
    radioButtons.forEach(radio => {
        radio.disabled = true;
    });
    updateProgressBar();
    starteRunde();
}

function zeigeStatistik() {

    frageContainer.innerHTML = "<h1>Deine Statistik:";
    buttonContainer.style.display = "none";
    statistikContainer.style.display = "block";
    let richtigeInsgesamt = 0;
    let htmlString = "Bisher gespielte Kategorien: " + gespielteKategorien.length + "<br>";

    //Kategorie und Anzahl der richtigen Antworten in dieser Kategorie anzeigen
    for (let i=0; i < gespielteKategorien.length; i++) {
        htmlString = htmlString + "<br>" + gespielteKategorien[i] + ": " + richtigeProKategorie[i] + "/" + FRAGEN_PRO_RUNDE;
    }

    //Richtige insgesamt ermitteln
    for (let i=0; i < richtigeProKategorie.length; i++) {
        richtigeInsgesamt += richtigeProKategorie[i];
    }
    htmlString = htmlString + "<br><br>Gesamt: " + richtigeInsgesamt + " / " + gewerteteAntworten.length +
    "<br>SCORE: " + richtigeInsgesamt/gewerteteAntworten.length*100 + "%";

    //fertiger String in Statistikcontainer anzeigen
    statistikContainer.innerHTML = htmlString;

    //RadioButtons, dessen Kategorie noch nicht gespielt wurde, wieder aktivieren
    radioButtons.forEach(radio => {
        if (gespielteKategorien.includes(radio.value)) {

        } else {
            radio.disabled = false;
        }
    });
}
