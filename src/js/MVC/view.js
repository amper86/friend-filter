module.exports = class {
    constructor() { }

    render(tempName, model) {
        return require(`../../tamplate/${tempName}.hbs`)(model);
    }
    
}