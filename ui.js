class Root {
    constructor(target) {
        this.target = target || process.stdout;
    }
    render(component) {
        const map = Array.from(Array(this.target.rows), () => Array(this.target.columns).fill(" "));
        const regions = component.render();
        function put(x, y, c) {
            map[y] && map[y][x] && (map[y][x] = c);
        }
        for (let i = 0; i < regions.length; i++) {
            let region = regions[i];
            if (region) {
                if (typeof region.result === "string") {
                    const component = region.component;
                    const rows = region.result.split("\n");
                    for (let y = 0; y < rows.length; y++) {
                        for (let x = 0; x < rows[y].length; x++) {
                            put(component.x + x, component.y + y, rows[y][x]);
                        }
                    }
                } else {
                    regions.push(...(Array.isArray(region.result) ? region.result : [region.result]));
                }
            }
        }
        console.clear();
        // this.target.cursorTo(0, 0, () => {
        process.stdout.write(map.map(_ => _.join("")).join("\n"));
        // });
    }
}
class Component {
    constructor({ x, y, children = [], props = {} }) {
        this.x = x;
        this.y = y;
        this.children = children;
        this.props = props;
        this.children.forEach((child) => child.setParent(this));
        this.parent = null;
    }
    setParent(parent) {
        this.parent = parent;
    }
    render() {
        return this.children.map(child => child && ({
            result: child.render(),
            component: child
        }));
    }
}
let { columns: width, rows: height } = process.stdout;
width = width || 100;
height = (height || 11) - 1;
class ProgressBar extends Component {
    constructor({ x, y, children, props = {
        total: 1,
        progress: 0
    } }) {
        super({ x, y, children, props });
        this.total = props.total;
        this.progress = props.progress;
    }
    render() {
        const percent = Math.max(0, Math.min(this.progress / this.total, 1));
        return `[${"█".repeat(Math.floor(percent * (width - 7)))}${"▒".repeat((width - 7) - Math.floor(percent * (width - 7)))}]${Math.floor(100 * percent)}%`
    }
}

class Text extends Component {
    constructor({ x = 0, y = 0, children, props = {
        total: 1,
        progress: 0
    } }) {
        super({ x, y, children, props });
        this.text = props.text;
    }
    render() {
        return this.text;
    }
}


process.stdout.on("resize", (e) => {
    width = process.stdout.columns || 100;
    height = (process.stdout.rows || 11) - 1;
})




const ui = new Root(process.stdout);


function render({
    percent,
    currentFile = "you can put the progress bar description here",
    max = 100
}) {
    ui.render(new Component({
        x: 0, y: 0, children: [
            new Text({
                x: 0,
                y: Math.floor(height / 2) - 1,
                props: {
                    text: currentFile
                }
            }),
            new ProgressBar({
                x: 0,
                y: Math.floor(height / 2),
                props: {
                    total: max,
                    progress: percent
                }
            }),
            new Text({
                x: 0,
                y: height,
                props: {
                    text: "Press X to See Logs"
                }
            }),
            new Text({
                x: Math.floor(width-15),
                y: height,
                props: {
                    text: "Press Q to quit"
                }
            })
        ]
    }));
}

function SAC(){
    ui.render(new Component({
        x: 0, y: 0, children: [
            new Text({
                x: Math.floor(width/2-14),
                y: Math.floor(height / 2),
                props: {
                    text: "║Starting up and configuring║"
                }
            }),
            new Text({
                x: Math.floor(width/2-14),
                y: Math.floor(height/2 + 1),
                props: {
                    text: "╚═══════════════════════════╝"
                }
            }),
            new Text({
                x: Math.floor(width/2-14),
                y: Math.floor(height/2 - 1),
                props: {
                    text: "╔═══════════════════════════╗"
                }
            })
        ]
    }));
}

function loginDescription(){
    ui.render(new Component({
        x: 0, y: 0, children: [
            new Text({
                x: 0,
                y: Math.floor(height-2),
                props: {
                    text: " Please enter your steam login credentials"
                }
            }),
            new Text({
                x: 0,
                y: Math.floor(height-1),
                props: {
                    text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
                }
            })
        ]
    }));
}

function quit(){
    ui.render(new Component({
        x: 0, y: 0, children: [
            new Text({
                x: Math.floor(width/2-14),
                y: Math.floor(height/2 + 2),
                props: {
                    text: "╚═══════════════════════════╝"
                }
            }),
            new Text({
                x: Math.floor(width/2-14),
                y: Math.floor(height/2 - 1),
                props: {
                    text: "╔═══════════════════════════╗"
                }
            }),
            new Text({
                x: Math.floor(width/2-14),
                y: Math.floor(height/2),
                props: {
                    text: "║  Please confirm to quit!  ║"
                }
            }),
            new Text({
                x: Math.floor(width/2-14),
                y: Math.floor(height/2 + 1),
                props: {
                    text: "║            Y/N            ║"
                }
            })
        ]
    }));
}

function quitconfirm(){
    ui.render(new Component({
        x: 0, y: 0, children: [
            new Text({
                x: Math.floor(width/2-14),
                y: Math.floor(height / 2),
                props: {
                    text: "║ Quitting the application! ║"
                }
            }),
            new Text({
                x: Math.floor(width/2-14),
                y: Math.floor(height/2 + 1),
                props: {
                    text: "╚═══════════════════════════╝"
                }
            }),
            new Text({
                x: Math.floor(width/2-14),
                y: Math.floor(height/2 - 1),
                props: {
                    text: "╔═══════════════════════════╗"
                }
            })
        ]
    }));
}

// let percent = 0;
// const id = setInterval(() => {
//     if(percent >= 100){
//         clearInterval(id);
//     }
//     render({
//         percent,
//         currentFile: "yo, whats up?"
//     });
//     percent += Math.random();
// }, 100);

module.exports.render = render
module.exports.SAC = SAC
module.exports.loginDescription = loginDescription
module.exports.quit = quit
module.exports.quitconfirm = quitconfirm


// if(percent >= 100){
//     clearInterval(id);
// }
// checks if the percentage is equal or greater than 100 and then stops the interval from updating 