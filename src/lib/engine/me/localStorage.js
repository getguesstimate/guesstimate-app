const globalKey='Guesstimate-Test'
const reducer='me'
const varName=(globalKey + reducer)

export function get(){
  try {
    return JSON.parse(localStorage.getItem(varName))
  } catch(e) {
    set(null)
    return null
  }
}

export function set(item){
  localStorage.setItem(varName, JSON.stringify(item));
}

export function clear(){
  return localStorage.removeItem(varName, 0)
}

