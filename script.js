const btnInc = document.getElementById("btn-inc");
const btnDec = document.getElementById("btn-dec");
const btnPush = document.getElementById("btn-push");
const btnPop = document.getElementById("btn-pop");
const inputFirstName = document.getElementById("input-first");
const inputLastName = document.getElementById("input-last");
const outputName = document.getElementById("output-name");
const outputCounter = document.getElementById("output-counter");
const outputArray = document.getElementById("output-array");

let currentAction = null;

const [firstName, setFirstName] = createSignal("");
const [lastName, setLastName] = createSignal("");

inputFirstName.addEventListener("input", (e) => {
    setFirstName(e.target.value);
});

inputLastName.addEventListener("input", (e) => {
    setLastName(e.target.value);
});

const [count, setCount] = createSignal({ count: 0 });

btnInc.addEventListener("click", () => {
    setCount((prev) => ({ ...prev, count: prev.count + 1 }));
});
btnDec.addEventListener("click", () => {
    setCount((prev) => ({ ...prev, count: prev.count - 1 }));
});

const fullname = () => `${firstName()} ${lastName()}`;
createEffect(() => {
    outputName.textContent = fullname();
});

createEffect(() => {
    outputCounter.textContent = count().count;
});

const [items, setItems] = createSignal([]);
btnPush.addEventListener("click", () => {
    setItems((prev) => [...prev, Date.now()]);
});
btnPop.addEventListener("click", () => {
    setItems((prev) => {
        const p = [...prev];
        p.pop();
        return p;
    });
});
createEffect(() => {
    outputArray.textContent = JSON.stringify(items());
});

function createEffect(effect) {
    const action = () => {
        currentAction = action;
        effect();
        currentAction = null;
    };
    action();
}

function createSignal(initial) {
    let v = initial;
    const effects = new Set();

    function get() {
        if (currentAction) {
            effects.add(currentAction);
        }
        return v;
    }

    function set(args) {
        if (typeof args === "function") {
            v = args(v);
        } else {
            v = args;
        }
        effects.forEach((effect) => {
            effect();
        });
    }
    return [get, set];
}
