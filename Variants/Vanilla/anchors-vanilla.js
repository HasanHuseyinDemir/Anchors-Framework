function html(data, ...keys) {
    let elements = [];
    let keyList = [...keys];
    data.forEach((item, index) => {
        elements.push(item);
        keyList[index] !== undefined?elements.push(keyList[index]):""
    });
    let str = "";
    elements.forEach((item) => {
        typeof item == "string" ? str += item : str += `<q></q>`;
    });
    let el = document.createRange().createContextualFragment(str);
    [...keys].forEach((key) => {el.querySelector("q").replaceWith((typeof key == "object" || typeof key == "number")?key:typeof key=="function"?key():"")});
    return el;
}

Object.prototype.render = function (s) {
    this.textContent = "";
    this.append(typeof s == "object"?s:typeof s=="function"?s():"");
};
