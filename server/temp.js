const date = new Date().toISOString()
console.log("🚀 ~ date:", date)
const newDate = new Date().toISOString().replace(/[:.]+/gm,"-")
console.log("🚀 ~ Date:", newDate)
