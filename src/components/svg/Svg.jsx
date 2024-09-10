export function Cart({ color, size }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size ? size : "20"}
      height={size ? size : "20"}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color ? color : "#000"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="icon icon-tabler icons-tabler-outline icon-tabler-shopping-cart"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M6 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
      <path d="M17 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
      <path d="M17 17h-11v-14h-2" />
      <path d="M6 5l14 1l-1 7h-13" />
    </svg>
  );
}
export function Info() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="icon icon-tabler icons-tabler-outline icon-tabler-info-circle"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
      <path d="M12 9h.01" />
      <path d="M11 12h1v4h1" />
    </svg>
  );
}
export function Logout({ size }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#bb0eca"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="icon icon-tabler icons-tabler-outline icon-tabler-logout"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
      <path d="M9 12h12l-3 -3" />
      <path d="M18 15l3 -3" />
    </svg>
  );
}

export function Plus ({color, size}){
  return (
    <svg  
      xmlns="http://www.w3.org/2000/svg"  
      width={size ? size : "20"}
      height={size ? size : "20"}  
      viewBox="0 0 24 24"  
      fill="none"  
      stroke={color ? color : "#000"}  
      strokeWidth="2"  
      strokeLinecap="round"  
      strokeLinejoin="round"  
      className="icon icon-tabler icons-tabler-outline icon-tabler-plus"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M12 5l0 14" />
      <path d="M5 12l14 0" />
    </svg>

  )
}


export function Asesor ({color, size}){
  return(
    <svg  xmlns="http://www.w3.org/2000/svg"  width={size ? size : "20"}  height={size ? size : "20"}  viewBox="0 0 24 24"  fill="none"  stroke={color ? color : "#000"}  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-headset"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 14v-3a8 8 0 1 1 16 0v3" /><path d="M18 19c0 1.657 -2.686 3 -6 3" /><path d="M4 14a2 2 0 0 1 2 -2h1a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-1a2 2 0 0 1 -2 -2v-3z" /><path d="M15 14a2 2 0 0 1 2 -2h1a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-1a2 2 0 0 1 -2 -2v-3z" /></svg>
  )
}

export function Right ({color, size}){
  return(
    <svg  xmlns="http://www.w3.org/2000/svg"  width={size ? size : "20"}  height={size ? size : "20"}  viewBox="0 0 24 24"  fill="none"  stroke={color ? color : "#000"} strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-right"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l14 0" /><path d="M13 18l6 -6" /><path d="M13 6l6 6" /></svg>  )
}

export function Top ({color, size}){
  return(
    <svg  xmlns="http://www.w3.org/2000/svg"  width={size ? size : "20"}  height={size ? size : "20"}  viewBox="0 0 24 24"  fill="none"  stroke={color ? color : "#000"}  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-up-to-arc"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 21v-12" /><path d="M8 13l4 -4l4 4" /><path d="M21 12a9 9 0 0 0 -18 0" /></svg>  )
}

