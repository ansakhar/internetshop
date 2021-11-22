const baseUrl = ''

         async function login() {
          
          let loginEmail = document.getElementById('email')
          let loginPassword = document.getElementById('password')
          let infoText = document.getElementById('infoText')
        

          let response = await fetch(`${baseUrl}/users/`+loginEmail.value)
          if (response.status === 200) {
          let user = await response.json()
           // console.log("user:", user)
            console.log(user._id)

            if (user.password === loginPassword.value) {
              location.replace("/shop/?userId="+user._id)
            }
            else {
              infoText.innerHTML = 'Password is not correct'
            }
          }
          else {
            infoText.innerHTML = `User with email "${loginEmail.value}" is not found`
          }
      }

 async function addUser() {
        
        let newEmail = document.getElementById('email')
        let newPassword = document.getElementById('password')
        let infoText = document.getElementById('infoText')

        infoText.innerHTML = ''

        const data = { 'email':  newEmail.value,
        'password': newPassword.value
     }
        const response = await fetch(`${baseUrl}/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
            if (response.status === 200) {
                console.log("post response ", response)
                let user = await response.json()
                return user
              }
            else {
            let error = await response.json()
            console.error(error.error)
            infoText.innerHTML = error.error
              }
        newEmail.value = ''
        newPassword.value = ''
      }

      async function register() {
        const response = await addUser()
        if (response) {
          console.log("user added")
          console.log("new user:", response)
          
          //creating a new cart for new user
          const data = { 'userId': response._id}
        await fetch(`${baseUrl}/carts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
          alert("You have been successfully registered!")
          setTimeout(function(){ location.replace("/shop/?userId="+response._id) }, 200)
        }
      }