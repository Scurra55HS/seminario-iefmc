/* =========================================
   CONFIGURAÇÃO
========================================= */

const CONFIG = {

    /*
        Horário de Brasília.
        31/10/2026 às 08:00.
    */

    dataEvento:
        "2026-10-31T08:00:00-03:00",

    whatsapp:
        "5582993471405"

};


/* =========================================
   ELEMENTOS
========================================= */

const header =
    document.getElementById("header");

const form =
    document.getElementById("form");

const inputNome =
    document.getElementById("nome");

const inputNumero =
    document.getElementById("numero");

const inputCasa =
    document.getElementById("casa");

const campoCasa =
    document.getElementById("campoCasa");

const mensagem =
    document.getElementById("mensagem");

const whatsappForm =
    document.getElementById("whatsappForm");

const whatsappFloat =
    document.getElementById("whatsappFloat");

const radios =
    document.querySelectorAll(
        'input[name="frequenta"]'
    );


/* =========================================
   HEADER
========================================= */

function controlarHeader() {

    if (!header) {
        return;
    }


    if (window.scrollY > 40) {

        header.classList.add("scrolled");

    } else {

        header.classList.remove("scrolled");

    }

}


window.addEventListener(
    "scroll",
    controlarHeader,
    {
        passive: true
    }
);


controlarHeader();


/* =========================================
   ANIMAÇÃO AO ROLAR
========================================= */

const elementosReveal =
    document.querySelectorAll(".reveal");


const observer =
    new IntersectionObserver(
        (entries, observerAtual) => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) {
                    return;
                }


                entry.target.classList.add("show");


                observerAtual.unobserve(
                    entry.target
                );

            });

        },
        {
            threshold: 0.12
        }
    );


elementosReveal.forEach(elemento => {

    observer.observe(elemento);

});


/* =========================================
   CONTADOR
========================================= */

const dataEvento =
    new Date(
        CONFIG.dataEvento
    ).getTime();


const diasElemento =
    document.getElementById("dias");

const horasElemento =
    document.getElementById("horas");

const minutosElemento =
    document.getElementById("minutos");

const segundosElemento =
    document.getElementById("segundos");

const countdown =
    document.querySelector(".countdown");


function doisDigitos(numero) {

    return String(numero).padStart(
        2,
        "0"
    );

}


function atualizarContador() {

    if (!countdown) {
        return;
    }


    const agora =
        Date.now();


    const diferenca =
        dataEvento - agora;


    if (diferenca <= 0) {

        countdown.innerHTML = `
            <div
                class="count-box"
                style="grid-column: 1 / -1;"
            >
                <strong>Evento iniciado!</strong>

                <span>
                    Seja bem-vindo.
                </span>
            </div>
        `;

        clearInterval(
            intervaloContador
        );

        return;

    }


    const totalSegundos =
        Math.floor(
            diferenca / 1000
        );


    const dias =
        Math.floor(
            totalSegundos / 86400
        );


    const horas =
        Math.floor(
            (totalSegundos % 86400) / 3600
        );


    const minutos =
        Math.floor(
            (totalSegundos % 3600) / 60
        );


    const segundos =
        totalSegundos % 60;


    diasElemento.textContent =
        dias;


    horasElemento.textContent =
        doisDigitos(horas);


    minutosElemento.textContent =
        doisDigitos(minutos);


    segundosElemento.textContent =
        doisDigitos(segundos);

}


const intervaloContador =
    setInterval(
        atualizarContador,
        1000
    );


atualizarContador();


/* =========================================
   MÁSCARA TELEFONE
========================================= */

function formatarTelefone(valor) {

    const numeros =
        valor
            .replace(/\D/g, "")
            .slice(0, 11);


    if (numeros.length === 0) {

        return "";

    }


    if (numeros.length <= 2) {

        return `(${numeros}`;

    }


    if (numeros.length <= 7) {

        return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;

    }


    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;

}


inputNumero.addEventListener(
    "input",
    event => {

        event.target.value =
            formatarTelefone(
                event.target.value
            );

        atualizarLinksWhatsApp();

    }
);


/* =========================================
   CASA ESPÍRITA
========================================= */

radios.forEach(radio => {

    radio.addEventListener(
        "change",
        event => {

            if (
                event.target.value === "sim"
            ) {

                campoCasa.classList.remove(
                    "hidden"
                );

                inputCasa.required =
                    true;

            } else {

                campoCasa.classList.add(
                    "hidden"
                );

                inputCasa.required =
                    false;

                inputCasa.value =
                    "";

            }


            atualizarLinksWhatsApp();

        }
    );

});


/* =========================================
   LOCAL STORAGE
========================================= */

function pegarInscricoes() {

    try {

        const dados =
            localStorage.getItem(
                "inscricoes"
            );


        return dados
            ? JSON.parse(dados)
            : [];

    } catch (erro) {

        console.error(
            "Não foi possível ler as inscrições:",
            erro
        );

        return [];

    }

}


function salvarInscricao(
    inscricao
) {

    try {

        const inscricoes =
            pegarInscricoes();


        inscricoes.push(
            inscricao
        );


        localStorage.setItem(
            "inscricoes",
            JSON.stringify(
                inscricoes
            )
        );


        return true;

    } catch (erro) {

        console.error(
            "Não foi possível salvar:",
            erro
        );

        return false;

    }

}


/* =========================================
   MENSAGEM
========================================= */

function mostrarMensagem(
    texto,
    tipo
) {

    mensagem.textContent =
        texto;


    if (tipo === "sucesso") {

        mensagem.style.color =
            "#16803a";

    } else {

        mensagem.style.color =
            "#b42318";

    }

}


/* =========================================
   FORM SUBMIT
========================================= */

form.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const nome =
            inputNome.value.trim();


        const numero =
            inputNumero.value.trim();


        const numeroLimpo =
            numero.replace(
                /\D/g,
                ""
            );


        const frequenta =
            document.querySelector(
                'input[name="frequenta"]:checked'
            );


        const casa =
            inputCasa.value.trim();


        /* -------------------------------
           NOME
        -------------------------------- */

        if (nome.length < 4) {

            mostrarMensagem(
                "Digite seu nome completo.",
                "erro"
            );

            inputNome.focus();

            return;

        }


        /* -------------------------------
           TELEFONE
        -------------------------------- */

        if (
            numeroLimpo.length !== 10 &&
            numeroLimpo.length !== 11
        ) {

            mostrarMensagem(
                "Digite um número de WhatsApp válido.",
                "erro"
            );

            inputNumero.focus();

            return;

        }


        /* -------------------------------
           RADIO
        -------------------------------- */

        if (!frequenta) {

            mostrarMensagem(
                "Informe se você frequenta alguma casa espírita.",
                "erro"
            );

            return;

        }


        /* -------------------------------
           CASA
        -------------------------------- */

        if (
            frequenta.value === "sim" &&
            casa.length < 2
        ) {

            mostrarMensagem(
                "Informe o nome da instituição.",
                "erro"
            );

            inputCasa.focus();

            return;

        }


        /* -------------------------------
           OBJETO
        -------------------------------- */

        const inscricao = {

            id:
                crypto.randomUUID
                    ? crypto.randomUUID()
                    : String(Date.now()),

            nome,

            numero,

            frequenta:
                frequenta.value,

            casa:
                frequenta.value === "sim"
                    ? casa
                    : "Não frequenta",

            data:
                new Date().toLocaleString(
                    "pt-BR"
                )

        };


        /* -------------------------------
           SALVAR
        -------------------------------- */

        const salvou =
            salvarInscricao(
                inscricao
            );


        if (!salvou) {

            mostrarMensagem(
                "Não foi possível registrar os dados neste dispositivo.",
                "erro"
            );

            return;

        }


        /* -------------------------------
           SUCESSO
        -------------------------------- */

        mostrarMensagem(
            "Inscrição registrada com sucesso!",
            "sucesso"
        );


        form.reset();


        campoCasa.classList.add(
            "hidden"
        );


        inputCasa.required =
            false;


        atualizarLinksWhatsApp();

    }
);


/* =========================================
   WHATSAPP
========================================= */

function criarMensagemWhatsApp() {

    const nome =
        inputNome.value.trim();


    const numero =
        inputNumero.value.trim();


    const frequenta =
        document.querySelector(
            'input[name="frequenta"]:checked'
        )?.value || "";


    const casa =
        inputCasa.value.trim();


    let texto =
        "Olá! Gostaria de me inscrever no Seminário IEFMC 2026 — A Terapia do Autoamor.";


    if (nome) {

        texto +=
            `\n\nMeu nome: ${nome}`;

    }


    if (numero) {

        texto +=
            `\nWhatsApp: ${numero}`;

    }


    if (
        frequenta === "sim" &&
        casa
    ) {

        texto +=
            `\nInstituição: ${casa}`;

    }


    return texto;

}


function atualizarLinksWhatsApp() {

    const mensagemWhatsapp =
        criarMensagemWhatsApp();


    const url =
        `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(
            mensagemWhatsapp
        )}`;


    if (whatsappForm) {

        whatsappForm.href =
            url;

    }


    if (whatsappFloat) {

        whatsappFloat.href =
            url;

    }

}


[inputNome, inputCasa]
    .forEach(input => {

        input.addEventListener(
            "input",
            atualizarLinksWhatsApp
        );

    });


atualizarLinksWhatsApp();


/* =========================================
   WHATSAPP FLUTUANTE
========================================= */

function controlarWhatsApp() {

    if (!whatsappFloat) {
        return;
    }


    if (window.scrollY > 350) {

        whatsappFloat.classList.add(
            "show"
        );

    } else {

        whatsappFloat.classList.remove(
            "show"
        );

    }

}


window.addEventListener(
    "scroll",
    controlarWhatsApp,
    {
        passive: true
    }
);


controlarWhatsApp();