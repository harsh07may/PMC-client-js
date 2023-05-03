//? to check if two arrays have common elements
function isIntersecting(arrA, arrB) {
  //* use sets if arrB.length > 15
  //const setB = new Set(arrB);
  //return arrA.some((a) => setB.has(a));

  return arrA.some((a) => arrB.includes(a));
}

export { isIntersecting };
