import './style.css'
import Collection from './collection.ts'

(globalThis as any).Collection = Collection;


document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
   <h1>La classe Collection est accessibe en dans la console</h1>
  </div>
`