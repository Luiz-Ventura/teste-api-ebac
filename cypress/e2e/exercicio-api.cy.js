/// <reference types= "cypress"/>
import contrato from '../contracts/usuarios.contratos'
import {faker} from '@faker-js/faker'
describe('Testes da Funcionalidade Usuários', () => {
let token
beforeEach(() => {
  cy.token('fulano@qa.com' , 'teste').then(tkn  => {
    token = tkn
  })
});
  it('Deve validar contrato de usuários', () => {
    cy.request('usuarios').then(response =>{
      return contrato.validateAsync(response.body)
    })
  });

  it('Deve listar usuários cadastrados - GET', () => {
    cy.request({
      method: 'GET',
      url: 'usuarios'
    }).should((response) =>{
      expect(response.status).equal(200)
      expect(response.body).to.have.property('usuarios')
    })
  });

  it('Deve cadastrar um usuário com sucesso - POST', () => {
    const email = faker.internet.email()
   cy.cadastrarUsuario(token, 'Fulano da Silvaa', email, 'teste', 'true')
      .should((response) =>{
      expect(response.status).equal(201)
      expect(response.body.message).equal('Cadastro realizado com sucesso')
    })
  });

  it('Deve validar um usuário com email inválido - POST', () => {
    cy.cadastrarUsuario(token, 'Fulano da Silvaa', 'beltrano@qa.com.br', 'teste', 'true')
      .should((response) =>{
      expect(response.status).equal(400)
      expect(response.body.message).equal('Este email já está sendo usado')
    })
  })

  it('Deve editar um usuário previamente cadastrado - PUT', () => {
    const email = faker.internet.email()
   cy.cadastrarUsuario(token, 'Fulano da Silva Editado', email, 'editado', 'true')
   .then(response => {
    let id = response.body._id
     cy.request({
      method: 'PUT',
      url: `usuarios/${id}`,
      headers: {authorization: token},
      body: {
            "nome": "Fulano da Silva Editado",
            "email": email,
            "password": "teste",
            "administrador": "true",
        }
    }).should(response => {
      expect(response.status).to.equal(200)
      expect(response.body.message).to.equal('Registro alterado com sucesso')
    })
   })
   
  });

  it('Deve deletar um usuário previamente cadastrado - DELETE', () => {
    const user = faker.internet.username()
    const email = faker.internet.email()
    cy.cadastrarUsuario(token, user, email, 'delete', 'true')
    .then(response =>{
      let id = response.body._id
      cy.request({
        method: 'DELETE',
        url: `usuarios/${id}`,
        headers: {authorization: token}
      }).should(response =>{
        expect(response.status).to.equal(200)
        expect(response.body.message).to.equal('Registro excluído com sucesso')
    })
  })
  });

});



