import express from "express"

const app = express()

function calculateAgeParts(birthDate, currentDate) {
  let years = currentDate.getFullYear() - birthDate.getFullYear()
  let months = currentDate.getMonth() - birthDate.getMonth()
  let days = currentDate.getDate() - birthDate.getDate()
  let hours = currentDate.getHours() - birthDate.getHours()
  let minutes = currentDate.getMinutes() - birthDate.getMinutes()

  if (minutes < 0) {
    minutes += 60
    hours -= 1
  }

  if (hours < 0) {
    hours += 24
    days -= 1
  }

  if (days < 0) {
    const previousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0)
    days += previousMonth.getDate()
    months -= 1
  }

  if (months < 0) {
    months += 12
    years -= 1
  }

  return { years, months, days, hours, minutes }
}

app.get("/", (req, res) => {
  const { dob, age, months, days, hours, minutes, error } = req.query

  let ageMessage = ""

  if (error) {
    ageMessage = `<p style="color: #b91c1c;">${error}</p>`
  } else if (dob && age) {
    ageMessage = `<p style="color: #000;">Your age is ${age} years.</p>`
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
            background: #000;
            color: #fff;
          }

          .card {
            background: #fff;
            color: #000;
            padding: 2rem;
            border-radius: 12px;
            border: 2px solid #000;
            box-shadow: 0 10px 30px rgba(255, 255, 255, 0.1);
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
            border: 2px solid #000;
          }

          input {
            background: #fff;
            color: #000;
          }

          button {
            background: #000;
            color: #fff;
            cursor: pointer;
          }

          button:hover {
            background: #fff;
            color: #000;
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

  const birthDate = new Date(`${dob}T00:00:00`)

  if (Number.isNaN(birthDate.getTime())) {
    return res.redirect("/?error=Please+enter+a+valid+date.")
  }

  const now = new Date()
  const { years, months, days, hours, minutes } = calculateAgeParts(birthDate, now)

  return res.redirect(
    `/?dob=${encodeURIComponent(dob)}&age=${years}&months=${months}&days=${days}&hours=${hours}&minutes=${minutes}`,
  )
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})