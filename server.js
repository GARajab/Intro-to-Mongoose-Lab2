const mongoose = require("mongoose")
const prompt = require("prompt-sync")()
require("dotenv").config()
const express = require("express")
const app = express()
const Customer = require("./models/Customer")

mongoose.connect(process.env.MONGODB_URI)

mongoose.connection.on("connected", () => {
  console.log(`Database is connected, its name is: ${mongoose.connection.name}`)
})
start()
async function start() {
  console.log("Welcome to the CRM\n")

  while (true) {
    console.log("What would you like to do?\n")
    console.log("  1. Create a customer")
    console.log("  2. View all customers")
    console.log("  3. Update a customer")
    console.log("  4. Delete a customer")
    console.log("  5. Quit\n")

    const action = prompt("Number of action to run: ")

    switch (action) {
      case "1":
        await createCustomer()
        break
      case "2":
        await viewCustomers()
        break
      case "3":
        await updateCustomer()
        break
      case "4":
        await deleteCustomer()
        break
      case "5":
        await mongoose.connection.close()
        console.log("Exiting the Application")
        return
      default:
        console.log("Invalid option, please choose again.")
    }
  }
}

console.log(Customer)
async function createCustomer() {
  const name = prompt("What is the customer's name? ")
  const age = prompt("What is the customer's age? ")


  const customer = new Customer({ name, age })
  try {
    await customer.save() 
    console.log(`Customer ${name} added successfully!\n`)
  } catch (error) {
    console.error("Error adding customer: ", error)
  }
}

async function viewCustomers() {
  const customers = await Customer.find()
  console.log("Below is a list of customers:\n")
  customers.forEach((customer) => {
    console.log(
      `id: ${customer._id} -- Name: ${customer.name}, Age: ${customer.age}`
    )
  })
}

async function updateCustomer() {
  const customers = await Customer.find()
  console.log("Below is a list of customers:\n")
  customers.forEach((customer) => {
    console.log(
      `id: ${customer._id} -- Name: ${customer.name}, Age: ${customer.age}`
    )
  })

  const id = prompt(
    "Copy and paste the id of the customer you would like to update here: "
  )
  const newName = prompt("What is the customer's new name? ")
  const newAge = prompt("What is the customer's new age? ")

  await Customer.findByIdAndUpdate(id, { name: newName, age: newAge })
  console.log(`Customer updated successfully!\n`)
}

async function deleteCustomer() {
  const customers = await Customer.find()
  console.log("Below is a list of customers:\n")
  customers.forEach((customer) => {
    console.log(
      `id: ${customer._id} -- Name: ${customer.name}, Age: ${customer.age}`
    )
  })

  const id = prompt(
    "Copy and paste the id of the customer you would like to delete here: "
  )
  await Customer.findByIdAndDelete(id)
  console.log(`Customer deleted successfully!\n`)
}

const port = process.env.PORT ? process.env.PORT : 9000

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
