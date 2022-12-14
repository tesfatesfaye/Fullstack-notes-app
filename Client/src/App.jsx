import { useState, useEffect,useRef } from 'react'
import { ReactComponent as Gear } from '../public/gear.svg'
import Favicon from 'react-favicon'
const aPI_Base = 'http://localhost:3001'


function App() {

  const [todos, setTodos] = useState(() => [])
  const [newValue, setNewValue] = useState(()=>"");
  const [hoverState, setHoverState] = useState(()=>"")
  const[popUpStatus, setPopStatus]=useState(()=>"")
  const [idHolder,setIDholder]=useState(()=>"") 
  const ref=useRef(null)
  useEffect(() => {
    getTodos();

  }, [])
  

  useEffect(()=>{
    if(popUpStatus!=="" ){
      ref.current.focus()
    }
   
  
  },[newValue,popUpStatus])

  const completeTodo = async id => {
    const data = await fetch(aPI_Base + '/todo/complete/' + id, { method: "PUT" }).then(res => res.json());

    setTodos(todos => todos.map(todo => {
      // if (todo._id == id) {
      //   todo.complete = !todo.complete;
      // }
      return  todo._id==id ? {...todo,complete :!todo.complete} : todo
      
    }));

  }

  const deleteTodo = async (event, id) => {
    event.stopPropagation()
    const data = await fetch(aPI_Base + '/todo/delete/' + id, { method: "DELETE" }).then(res => res.json());

    setTodos(todos => todos.filter(todo => todo._id !== data._id));

  }



  const getTodos = () => {
    fetch(`${aPI_Base}/todos`)
      .then(res => res.json())
      .then(data => setTodos(data))
      .catch(err => console.error("Error: ", err))

  }
  const addTodo = async () => {
    const data = await fetch(aPI_Base + "/todo/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: newValue
      })
    }).then(res => res.json());

    setTodos([...todos, data])
    setPopStatus("")
    setNewValue("")

  }

  const updateTaskToggle = (event, id) => {
    event.stopPropagation()
    setIDholder(id)
    todos.map(x => {
      x._id === id ? setNewValue(x.text) : ""
    })

  }

  const updateTask = async (id) => {
    // console.log(`${aPI_Base}/todo/update/${id}`)
    const data = await fetch(`${aPI_Base}/todo/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      }, body: JSON.stringify({
        text: newValue
      })
    }).then(res => res.JSON)

    setTodos(prev => {
      return prev.map(x => {
        return x._id === id ? { ...x, text: newValue } : { ...x }
      })
    })
    setNewValue("")
    setPopStatus("")

  }
  return (
    <div className="App">
       <Favicon url='https://img.icons8.com/ios/50/null/to-do.png' />
      <h1>Welcome, Tesfa</h1>
      <h4>Your Tasks</h4>
      <div className='todos'>
        {todos.map(todo => {

          return (<div className={"todo " + (todo.complete ? "is-complete " : "")} key={todo._id} onClick={() => completeTodo(todo._id)}
            onMouseEnter={() => setHoverState(todo._id)} onMouseLeave={() => setHoverState("")}>
            <div className="checkbox">
            </div>
            <div className="text">{todo.text}</div>
            <Gear onClick={(event) => {
              setPopStatus("updateTask")
              updateTaskToggle(event, todo._id)
            }} className="svg" style={{ visibility: (hoverState === todo._id ? 'visible' : 'hidden') }} opacity='0.8' fill="white" height={25} />
            <div className="delete-todo" style={{ visibility: (hoverState === todo._id ? 'visible' : 'hidden') }} onClick={(event) => deleteTodo(event, todo._id)}>x</div>

          </div>)

        })}


      </div>
      <div className='addPopup' onClick={() => {
        setNewValue("")
        setPopStatus("addNew")

      }}>+</div>


      {popUpStatus==="addNew" ? <div className='popup'> <div className='closePopup' onClick={() => setPopStatus("")}> x</div>

        <div className='content'>

          <h3>Add Task</h3>
          <input ref={popUpStatus==="addNew" ? ref : ""}type="text" className='add-todo-input' onChange={e => setNewValue(e.target.value)}
           onKeyDown={e=> e.key==='Enter' ? addTodo() : ""}
            value={newValue}
          />
          <div className='button' onClick={addTodo}>Create Task</div>
        </div>



      </div> : ""}

      {popUpStatus==='updateTask' ? <div className='popup'> <div className='closePopup' onClick={() => {
        setPopStatus("")
        setNewValue("")
      }}> x</div>

        <div className='content'>

          <h3>Modify Task</h3>
          <input ref={popUpStatus==="updateTask" ?  ref : ""} type="text" className='add-todo-input' onChange={e => setNewValue(e.target.value)}
           onKeyDown={e=> e.key==='Enter' ? updateTask(idHolder) : ""}
            value={newValue}
          />
          <div className='button' onClick={() => updateTask(idHolder)}>Update Task</div>
        </div>



      </div> : ""}




    </div>
  )
}

export default App
