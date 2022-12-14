const express= require('express')
const mongoose=require('mongoose')
//
const cors=require('cors')
//
const app=express();
app.use(express.json());
app.use(cors());
mongoose.set('strictQuery', false)

mongoose.connect('mongodb://127.0.0.1:27017/react-todo', {
	useNewUrlParser: true, 
	useUnifiedTopology: true 
}).then(() => console.log("Connected to MongoDB")).catch(console.error);


const Todo= require('./models/Todo')

app.get('/todos', async (req, res) => {
	const todos = await Todo.find();
	console.log(todos.length)
	res.json(todos);
});
app.post('/todo/new',(req,res)=>{
	const todo=new Todo({
		text:req.body.text
	})
	todo.save();
	res.json(todo)
	
})

app.delete('/todo/delete/:id', async (req, res) => {
	const result = await Todo.findByIdAndDelete(req.params.id);

	res.json(result);
});
app.put('/todo/complete/:id', async (req, res) => {
	const todo = await Todo.findById(req.params.id);

	todo.complete=!todo.complete

	todo.save();

	res.json(todo);
});

app.put('/todo/update/:id',async(req,res)=>{
	const todo=await Todo.findByIdAndUpdate(req.params.id,{text:req.body.text})
	todo.save();
	res.json(todo)

})

app.listen(3001, ()=>console.log("Server started on port 3001"))