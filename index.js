import express from "express"

const app = express()

app.get("/", (req, res) => {
  const { dob, age, error } = req.query

  let ageMessage = ""

  if (error) {
    ageMessage = `<p style="color: #b91c1c;">${error}</p>`
  } else if (dob && age) {
    ageMessage = `<p style="color: #166534;">Your age is ${age} years.</p>`
  }

  res.send(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Date of Birth to Age</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            min-height: 100vh;
            display: grid;
            place-items: center;
            background: #f3f4f6;
          }

          .card {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            width: min(100%, 420px);
          }

          form {
            display: grid;
            gap: 1rem;
          }

          label {
            font-weight: 600;
          }

          input,
          button {
            font: inherit;
            padding: 0.75rem 1rem;
            border-radius: 8px;
            border: 1px solid #d1d5db;
          }

          button {
            border: none;
            background: #2563eb;
            color: white;
            cursor: pointer;
          }

          button:hover {
            background: #1d4ed8;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Age Calculator</h1>
          <form action="/age" method="get">
            <div>
              <label for="dob">Date of Birth</label>
              <input type="date" id="dob" name="dob" required />
            </div>
            <button type="submit">Calculate Age</button>
          </form>
          <div style="margin-top: 1rem;">${ageMessage}</div>
        </div>
      </body>
    </html>
  `)
})

app.get("/age", (req, res) => {
  const { dob } = req.query

  if (!dob || typeof dob !== "string") {
    return res.redirect("/?error=Please+select+a+date+of+birth.")
  }

  const birthDate = new Date(dob)

  if (Number.isNaN(birthDate.getTime())) {
    return res.redirect("/?error=Please+enter+a+valid+date.")
  }

  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()

  const monthDifference = today.getMonth() - birthDate.getMonth()
  const dayDifference = today.getDate() - birthDate.getDate()

  if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
    age -= 1
  }

  return res.redirect(`/?dob=${encodeURIComponent(dob)}&age=${age}`)
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})