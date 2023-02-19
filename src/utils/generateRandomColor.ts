export const generateRandomColor = () => {
  const colors = ["#F7FF93", "#EE81B3","#541690", "#FF8D29", "#42855B", "#3B9AE1"]
  let color = colors[Math.floor(Math.random() * 6)]
  localStorage.setItem("userColor", color)
}

export const getUserColor = () => {
  let color = localStorage.getItem("userColor")
  if(color){
    return color
  }else{
    return "red"
  }
  
}