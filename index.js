const link = document.getElementById('link')

link.addEventListener('click', (event) => {
    const option = event.path[0].innerText

    switch(option){
        case "Produtos":
            ProdutosComponent();
            break
        case "Carrinho":
            CarrinhoComponent();
            break
        default : view.getIndex()
    }
})