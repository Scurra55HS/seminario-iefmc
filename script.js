const CONFIG = {
    dataEvento: "2026-10-31T07:30:00-03:00",
    whatsapp: "558294270156",

    supabaseUrl: "https://kyexqnpewzsvzxltodxx.supabase.co",

    // Publishable key do projeto
    supabaseKey: "sb_publishable_IrHeJmjMbnM-Wgj2_pOy9g_lqSyk4Hn"
};


/* supabase */

const supabaseClient =
    window.supabase.createClient(
        CONFIG.supabaseUrl,
        CONFIG.supabaseKey
    );


/* elementos */

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

const btnEnviar =
    document.getElementById("btnEnviar");

const consentimento =
    document.getElementById("consentimento");

const radios =
    document.querySelectorAll(
        'input[name="frequenta"]'
    );


/* header */

function controlarHeader() {

    if (!header) {
        return;
    }

    header.classList.toggle(
        "scrolled",
        window.scrollY > 40
    );
}


window.addEventListener(
    "scroll",
    controlarHeader,
    {
        passive: true
    }
);


controlarHeader();


/* animações */

const elementosReveal =
    document.querySelectorAll(".reveal");


const observer =
    new IntersectionObserver(
        (entries, observerAtual) => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add(
                    "show"
                );

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


/* contador */

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

    const diferenca =
        dataEvento - Date.now();


    if (diferenca <= 0) {

        countdown.innerHTML = `
            <div
                class="count-box"
                style="grid-column: 1 / -1;"
            >
                <strong>
                    Evento iniciado!
                </strong>

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


/* telefone */

function formatarTelefone(valor) {

    const numeros =
        valor
            .replace(/\D/g, "")
            .slice(0, 11);


    if (!numeros) {
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


/* instituição */

radios.forEach(radio => {

    radio.addEventListener(
        "change",
        event => {

            const mostrarCasa =
                event.target.value === "sim";


            campoCasa.classList.toggle(
                "hidden",
                !mostrarCasa
            );


            inputCasa.required =
                mostrarCasa;


            if (!mostrarCasa) {
                inputCasa.value = "";
            }


            atualizarLinksWhatsApp();
        }
    );

});


/* mensagens */

function mostrarMensagem(
    texto,
    tipo
) {

    mensagem.textContent =
        texto;


    mensagem.style.color =
        tipo === "sucesso"
            ? "#16803a"
            : "#b42318";
}


/* inscrição */

form.addEventListener(
    "submit",
    async event => {

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


        /* validações */

        if (nome.length < 4) {

            mostrarMensagem(
                "Digite seu nome completo.",
                "erro"
            );

            inputNome.focus();

            return;
        }


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


        if (!frequenta) {

            mostrarMensagem(
                "Informe se você frequenta alguma casa espírita.",
                "erro"
            );

            return;
        }


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


        if (!consentimento.checked) {

            mostrarMensagem(
                "Você precisa concordar com o uso dos dados para concluir a inscrição.",
                "erro"
            );

            consentimento.focus();

            return;
        }


        /* evita duplo clique */

        btnEnviar.disabled = true;

        btnEnviar.textContent =
            "Enviando...";


        /* dados para o banco */

        const inscricao = {

            nome,

            whatsapp:
                numero,

            frequenta_casa:
                frequenta.value === "sim",

            casa_espirita:
                frequenta.value === "sim"
                    ? casa
                    : null,

            consentimento:
                consentimento.checked
        };


        try {

            const { error } =
                await supabaseClient
                    .from("inscricoes")
                    .insert(inscricao);


            if (error) {

                console.error(
                    "Erro do Supabase:",
                    error
                );

                mostrarMensagem(
                    "Não foi possível concluir a inscrição. Tente novamente.",
                    "erro"
                );

                return;
            }


            mostrarMensagem(
                "Inscrição realizada com sucesso!",
                "sucesso"
            );


            form.reset();


            campoCasa.classList.add(
                "hidden"
            );


            inputCasa.required =
                false;


            atualizarLinksWhatsApp();

        } catch (erro) {

            console.error(
                "Erro ao enviar inscrição:",
                erro
            );


            mostrarMensagem(
                "Não foi possível conectar ao servidor. Tente novamente.",
                "erro"
            );

        } finally {

            btnEnviar.disabled = false;

            btnEnviar.textContent =
                "Confirmar inscrição";
        }

    }
);


/* whatsapp */

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

    const texto =
        criarMensagemWhatsApp();


    const url =
        `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`;


    if (whatsappForm) {

        whatsappForm.href =
            url;
    }


    if (whatsappFloat) {

        whatsappFloat.href =
            url;
    }
}


[
    inputNome,
    inputNumero,
    inputCasa
].forEach(input => {

    input.addEventListener(
        "input",
        atualizarLinksWhatsApp
    );

});


radios.forEach(radio => {

    radio.addEventListener(
        "change",
        atualizarLinksWhatsApp
    );

});


atualizarLinksWhatsApp();


/* botão flutuante */

function controlarWhatsApp() {

    if (!whatsappFloat) {
        return;
    }


    whatsappFloat.classList.toggle(
        "show",
        window.scrollY > 350
    );
}


window.addEventListener(
    "scroll",
    controlarWhatsApp,
    {
        passive: true
    }
);


controlarWhatsApp();