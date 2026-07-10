import express from "express"

const app = express()

function parseDobInput(dob) {
  const match = dob.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)

  if (!match) {
    return { error: "Please select a valid date in dd/mm/yyyy format." }
  }

  const day = Number(match[1])
  const month = Number(match[2])
  const year = Number(match[3])

  if (
    !Number.isInteger(day) ||
    !Number.isInteger(month) ||
    !Number.isInteger(year) ||
    day < 1 ||
    day > 31 ||
    month < 1 ||
    month > 12 ||
    year < 1900 ||
    year > new Date().getFullYear()
  ) {
    return { error: "Please select a valid date in dd/mm/yyyy format." }
  }

  const birthDate = new Date(year, month - 1, day)

  if (
    birthDate.getFullYear() !== year ||
    birthDate.getMonth() !== month - 1 ||
    birthDate.getDate() !== day
  ) {
    return { error: "Please select a valid date in dd/mm/yyyy format." }
  }

  if (birthDate > new Date()) {
    return { error: "Date of birth cannot be in the future." }
  }

  return { birthDate }
}

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
    ageMessage = `
      <p style="color: #000; margin: 0 0 0.5rem;">Your age is:</p>
      <ul style="color: #000; margin: 0; padding-left: 1.25rem;">
        <li>${age} years</li>
        <li>${months ?? 0} months</li>
        <li>${days ?? 0} days</li>
        <li>${hours ?? 0} hours</li>
        <li>${minutes ?? 0} minutes</li>
      </ul>
    `
  }

  res.send(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Date of Birth to Age</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css" />
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

          .flatpickr-calendar {
            border: 2px solid #000;
            border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          }

          .flatpickr-day.selected,
          .flatpickr-day.startRange,
          .flatpickr-day.endRange {
            background: #000;
            border-color: #000;
          }

          .flatpickr-day.selected:hover,
          .flatpickr-day.startRange:hover,
          .flatpickr-day.endRange:hover {
            background: #333;
            border-color: #333;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Age Calculator</h1>
          <form action="/age" method="get">
            <div>
              <label for="dob">Date of Birth (dd/mm/yyyy)</label>
              <input
                type="text"
                id="dob"
                name="dob"
                value="${dob || ""}"
                placeholder="dd/mm/yyyy"
                required
                readonly
              />
            </div>
            <button type="submit">Calculate Age</button>
          </form>
          <div style="margin-top: 1rem;">${ageMessage}</div>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
        <script>
          flatpickr("#dob", {
            dateFormat: "d/m/Y",
            maxDate: "today",
            allowInput: false,
          })
        </script>
      </body>
    </html>
  `)
})

app.get("/age", (req, res) => {
  const { dob } = req.query

  if (!dob || typeof dob !== "string") {
    return res.redirect("/?error=Please+select+a+date+of+birth.")
  }

  const parsed = parseDobInput(dob)

  if (parsed.error) {
    return res.redirect(`/?dob=${encodeURIComponent(dob)}&error=${encodeURIComponent(parsed.error)}`)
  }

  const { birthDate } = parsed

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