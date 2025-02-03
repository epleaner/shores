import './style.css'
import Experience from './core/Experience'

window.addEventListener('load', () => {
    const canvas = document.querySelector('#experience')
    new Experience(canvas)
}) 