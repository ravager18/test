function getPromis(name, delay) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(`промис: ${name}`)
    }, delay)
  })
}

Promise.all(
  [getPromis('promis1a', 500), getPromis('promis1b', 1500)])
  .then((value) => {
    console.log(value)
    return getPromis('Promis2', 1000)
  })
  .then((value) => {
    console.log(value)
    return getPromis('Promis3', 1000)
  })
  .then((value) => {
    console.log(value)
  })


async function f() {
  const value1 = await Promise.all([getPromis('awaitPromis1a', 500), getPromis('awaitPromis1b', 600)])
  console.log(value1)
  const value2 = await getPromis('awaitPromis2', 500)
  console.log(value2)
}
f()