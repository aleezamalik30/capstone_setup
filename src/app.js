function runApp() {
  return 'Capstone setup is running successfully.';
}

if (require.main === module) {
  console.log(runApp());
}

module.exports = { runApp };
