# Age Calculator

A small Express.js app that lets you pick a date of birth and calculates the age in years, months, days, hours, and minutes.

## Features

- Date picker powered by Flatpickr
- Validates the date of birth format as `dd/mm/yyyy`
- Rejects invalid or future dates
- Shows the age breakdown after submission

## Requirements

- Node.js 18 or later
- npm

## Installation

```bash
npm install
```

## Run the app

Start the server with:

```bash
node index.js
```

By default, the app runs on port `3000`. You can change it with the `PORT` environment variable.

## Usage

1. Open `http://localhost:3000` in your browser.
2. Select your date of birth from the date picker.
3. Click **Calculate Age**.
4. The app redirects back to the home page and displays the calculated age.

## Project Structure

- `index.js` - Express server, validation, and age calculation logic
- `package.json` - Project metadata and dependencies

## Notes

- The input accepts dates in `dd/mm/yyyy` format.
- The app loads Flatpickr from a CDN.
- The home page and result view are rendered directly from the server.