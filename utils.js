function createTag(el, div = document.createElement('div')) {
    let lt = document.createElement('span');
    let tag = document.createElement('span');
    let gt = document.createElement('span');

    lt.classList.add('braces');
    if (!el.closing && el.indent > 0) {
        div.classList.add('indent-' + el.indent);
    }
    if (el.closing) {
        lt.textContent = '</';
    } else {
        lt.textContent = '<';
    }

    tag.classList.add('tag')
    tag.textContent = el.tag;

    gt.classList.add('braces');
    gt.textContent = '>';

    div.appendChild(lt);
    div.appendChild(tag);
    createAttrs(div, el.attrs);
    div.appendChild(gt);
    document.body.appendChild(div);
    if (el.text) {
        return createText(el.text, div).then(() => {
            let closingEl = JSON.parse(JSON.stringify(el));
            delete closingEl.text;
            closingEl.closing = true;
            createTag(closingEl, div);
        })
    }

    return Promise.resolve();
}

function createAttrs(parent, attrs = []) {
    attrs.forEach(attr => {
        let at = document.createElement('span');
        let eq = document.createElement('span');
        let val = document.createElement('span');
        let space = document.createTextNode(` `);
        at.classList.add('attr');
        eq.classList.add('eq');
        val.classList.add('val');
        at.textContent = attr.name;
        eq.textContent = "="
        val.textContent = `"${attr.val}"`
        parent.appendChild(space);
        parent.appendChild(at);
        parent.appendChild(eq);
        parent.appendChild(val);
    })
}

function createText(text, parent) {
    console.log(text);
    let t = document.createElement('span');
    t.classList.add('text');
    parent.appendChild(t);
    let splittedText = text.split('');
    t.textContent = "";
    return splittedText.reduce((acc, curr, idx) => {
        return acc.then((text) => {
            t.textContent += text ? text : "";
            return new Promise((res) => {
                setTimeout(() => {
                    // t.textContent += curr;
                    res(curr);
                }, text == `?` || text == `!` || text == `.` || text == `\n` ? 800 : 50);
            })
        })
    }, Promise.resolve()).then((text) => {
        t.textContent += text ? text : "";
    });
}

const myText = [
    {
        tag: 'html',
        attrs: [
            {name: 'lang', val: 'love' }
        ]
    },
    {
        tag: 'head'
    },
    {
        tag: 'meta',
        attrs: [
            {name: 'charset', val: 'utf-8' }
        ],
        indent: 1
    },
    {
        tag: 'title',
        text: 'Para o meu amor',
        indent: 1
    },
    {
        tag: 'head',
        closing: true
    },
    {
        tag: 'body'
    },
    {
        tag: 'p',
        indent: 1,
        text: 'Hey amor\n\nVocê lembra onde estava nesse mesmo dia no ano de 2018? Eu lembro! Um ano atrás estávamos no Jesus comemorando o teu dia. Nesse mesmo dia eu não imaginava quantas voltas minha vida daria até encontrar e descansar na tua. Feliz aniversário meu amor. Você merece ser feliz todos os dias da tua vida. Sou tão grata por você estar na minha vida e fazer dela mais feliz, mais organizada e com certeza com mais amor.\n\nOlhando para o passado, me recordo de todas as vezes que eu reneguei o amor, que eu o massacrei, que eu achei nunca ter amado e que jamais seria capaz de amar alguém. Bom, fui enganada por mim mesma e o universo decidiu me provar o contrário, te colou na minha vida. O cara com o coração mais bondoso que eu conheço, o homem com o sorriso mais lindo e cativante. Você é um achadinho no mundo, você é luz, é fogo que aquece a minha alma e principalmente, você é amor.\nSempre estarei aqui para você e com você, não esquece.\n\n\tEu te amo, Rafael.'
    },
    {
        tag: 'body',
        closing: true
    },
    {
        tag: 'html',
        closing: true
    }
];

setTimeout(() => {
    myText.reduce((acc, curr) => {
        return acc.then(() => {
            return new Promise(res => {
                setTimeout(() => {
                    createTag(curr).then(res);
                }, 600);
            })
        })
        
    }, Promise.resolve())
}, 11000); 