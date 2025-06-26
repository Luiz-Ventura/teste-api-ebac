Cypress.Commands.add('token', (email, senha) => {
     cy.request({
            method: 'POST',
            url: 'login',
            body: {
                "email": email,
                "password": senha 
            }
        }).then( response =>{
            return response.body.authorization
        })
 })

 Cypress.Commands.add('cadastrarProduto' , (token, produto, preco, descricao, quantidade) =>{
    cy.request({
        method: 'POST', 
        url: 'produtos',
        headers: {authorization: token}, 
        body: {
            "nome": produto,
            "preco": preco,
            "descricao": descricao,
            "quantidade": quantidade
          }, 
          failOnStatusCode: false
    })
 })

 Cypress.Commands.add('cadastrarUsuario' , (token, usuario, email, senha, adm) =>{
    cy.request({
      method: 'POST',
      url: 'usuarios',
      headers:{authorization: token},
      body: {
            "nome": usuario,
            "email": email,
            "password": senha,
            "administrador": adm
            },
            failOnStatusCode: false
 })
})