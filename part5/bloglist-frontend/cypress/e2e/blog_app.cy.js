describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')

    const user = {
    	name: 'Adriana Tudor',
     	username: 'atudor',
     	password: '12345abc'
    }

    const user2 = {
    	name: 'Victoria Tudor',
     	username: 'victoriat',
     	password: 'sekret'
    }

    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.request('POST', 'http://localhost:3003/api/users/', user2)

    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('log in to application')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('atudor')
     	cy.get('#password').type('12345abc')
     	cy.contains('login').click()

     	cy.contains('Adriana Tudor logged in')
    })

    it('fails with wrong credentials', function() {
    	cy.get('#username').type('atudor')
     	cy.get('#password').type('wrong')
     	cy.contains('login').click()

     	cy.get('.error').contains('wrong username or password')
     	cy.get('.error').should('have.css', 'border-color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'atudor', password: '12345abc' })
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()

      cy.get('#title').type('My first blog')
      cy.get('#author').type('Adriana Tudor')
      cy.get('#url').type('www.myblog.com')

      cy.get('#createBtn').click()

      cy.get('.success').contains('a new blog My first blog by Adriana Tudor added.')
    })

    describe('and a blog exists', function() {
			beforeEach(function() {
			  cy.createBlog({ title: 'My second blog', author: 'Adriana Tudor', url: 'www.myblog.com' })
			})

			it('users can like a blog', function() {
			  cy.contains('My second blog Adriana Tudor').contains('view').click()
			  cy.contains('My second blog Adriana Tudor').contains('like').click()

			  cy.contains('My second blog Adriana Tudor').contains('likes 1')
			})

				it('user who created a blog can delete it', function() {
			  cy.contains('My second blog Adriana Tudor').contains('view').click()
			  cy.contains('My second blog Adriana Tudor').contains('remove').click()

			  cy.get('html').should('not.contain', 'My second blog Adriana Tudor')
			})

			it('user who created a blog can delete it', function() {
				cy.login({ username: 'victoriat', password: 'sekret' })

			  cy.contains('My second blog Adriana Tudor').contains('view').click()
			  cy.contains('My second blog Adriana Tudor').contains('remove').click()

			  cy.get('html').should('contain', 'My second blog Adriana Tudor')

			  cy.get('.error').contains('action not allowed')
					cy.get('.error').should('have.css', 'border-color', 'rgb(255, 0, 0)')
			})
    })

    describe('and a multiple blogs exists', function() {
      beforeEach(function() {
		  	cy.createBlog({ title: 'My first blog', author: 'Adriana Tudor', url: 'www.myblog.com', likes: 33 })
		  	cy.createBlog({ title: 'My second blog', author: 'Adriana Tudor', url: 'www.myblog.com', likes: 35 })
		  	cy.createBlog({ title: 'My third blog', author: 'Adriana Tudor', url: 'www.myblog.com', likes: 24 })
      })

      it('the posts are ordered according to their likes', function(){
        cy.get('.blog').eq(0).should('contain', 'My second blog')
        cy.get('.blog').eq(1).should('contain', 'My first blog')
        cy.get('.blog').eq(2).should('contain', 'My third blog')
      })

      it('check if order is updated after liking the second most-liked post', function(){
        cy.contains('My first blog').contains('view').click()
        cy.contains('My first blog').contains('like').click()
        cy.get('.blog').contains('My first blog').contains('likes 34')

        cy.contains('My first blog').contains('like').click()
        cy.get('.blog').contains('My first blog').contains('likes 35')

        cy.contains('My first blog').contains('like').click()
        cy.get('.blog').contains('My first blog').contains('likes 36')

        cy.get('.blog').eq(0).contains('My first blog')
      })
    })
  })
})