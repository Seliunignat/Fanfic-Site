import { data } from 'jquery'
import React, {useContext, useState, useEffect} from 'react'
import { useHistory } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { useHttp } from '../hooks/http.hook'
import { useMessage } from '../hooks/message.hook'
//const Chapter = require('../../../models/Chapter')

export const CreateTextPage = () => {
    const message = useMessage();
    const auth = useContext(AuthContext)
    const history = useHistory()
    const { loading, request, error, clearError } = useHttp();
    const [textTitle, setTextTitle] = useState('')
    const [numberOfChapters, setNumberOfChapters] = useState(0)
    const [chapters, setChapters] = useState(new Array(0))
    const [form, setForm] = useState({
        title: "",
        author: auth.userId,
        date: null,
        //chapters: null
    });


    const addNewChapter = () => {
        chapterAccordions.push("chapterAccordion" + (chapterAccordions.length + 1))
        console.log(chapterAccordions)
        writeChapterAccordions()
    }

    const redirectToUserPage = () => {
        history.push('/user')
    }

    const createHandler = async () => {
        for (let i = 0; i < chapterAccordions.length; i++) {
            const idChaptertitle = 'chapter' + (i+1) + 'Title'
            const chapterTitle = document.getElementById(idChaptertitle).value
            console.log(chapterTitle)
            const idtextArea = 'chapter' + (i+1) + 'TextArea'
            const chapterContent = document.getElementById(idtextArea).value
            console.log(chapterContent)
            var curr_chapter = {id: i, chapterTitle: chapterTitle, content: chapterContent, order: null, likes: 0}  
            chapters.push(curr_chapter)
            console.log(chapters)         
        }
        try {
            const data_req = await request('/api/text/create', 'POST', {title: form.title, author: auth.userId, chapters: chapters}, {Authorization: `Bearer ${auth.token}`})
            console.log(data)
            message(data_req.message)
            if(data_req.message === 'Фанфик успешно создан')
                history.push('/user')
        } catch (e) {
            
        }
    }

    const changeHandler = (event) => {
        //console.log(event.target.name)
        //if(event.target.name)
        setForm({ ...form, [event.target.name]: event.target.value });        
    };

    useEffect(() => {
        console.log('Error', error)
        message(error);
        clearError();
    }, [error, message, clearError]);

    const chapterAccordions= []

    const writeChapterAccordions = () => {
        //document.querySelector('#chapters').innerHTML = ''     
        for (let i = 0; i < chapterAccordions.length; i++) {               
            //console.log(`${selector}`)
            //console.log(document.getElementById(chapterAccordions[i]))
            if(!document.querySelector(`#${chapterAccordions[i]}`)){
                document.querySelector("#chapters").insertAdjacentHTML("beforeend", `
                <div id="${chapterAccordions[i]}" class="accordion" style="width: 40rem;">
                    <div class="accordion-item">
                        <h2 class="accordion-header" id="heading${i+1}">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${i+1}" aria-expanded="false" aria-controls="collapse${i+1}">
                                Глава ${i+1}: <input 
                                        class="form-control " 
                                        id="chapter${i+1}Title"   
                                        name="chapter${i+1}Title"
                                        type="text"
                                        placeholder="Title" 
                                        style="width: 18rem; margin-left: 10px;" 
                                        // onChange="changeHandler"
                                        // required={true}                                                                    
                                        ></input>
                            </button>
                        </h2>
                        <div id="collapse${i+1}" class="accordion-collapse collapse" aria-labelledby="heading${i+1}" data-bs-parent="#chaptersAccordion">
                            <div class="accordion-body">
                                <textarea class="form-control" id="chapter${i+1}TextArea" type="text" style="width: 40rem; margin-left: -1.4rem; margin-top: -1rem; margin-bottom: -1rem;"></textarea>
                            </div>
                        </div>
                    </div>        
                </div>
                `)   
            }         
        }        
    }

    return(
        <div className="centeredElement">            
            <div className="card rounded dShadow" style={{width: '60rem'}}>
                {/* Card Head */}
                <div className="card-head" style={{textAlign: 'center'}}> 
                    <h1>Create new fanfic</h1> 
                </div>
                {/* Card Body */}
                <div className="card-body">
                    <div className="container ">
                        <div className="row " >
                            <div className="col-3 mx-auto"></div>
                            <div className="col-1 mx-auto" style={{textAlign: 'right'}}>
                                <h5 style={{marginTop: '0.5rem'}}>Title: </h5>
                            </div> 
                            <div className="col mx-auto mb-2">
                                <input 
                                className="form-control" 
                                id="textTitle" 
                                name="title"
                                type="text"
                                placeholder="Title" 
                                style={{width: '18rem'}} 
                                required={true}
                                onChange={changeHandler}                                
                                ></input>
                            </div>                     
                            
                        </div>                        
                    </div>  
                    <div className="row mb-2">
                        <div className="col-3 mx-auto">
                            <h2>Chapters: </h2> 
                        </div>
                        <div className="col-2 mx-auto" style={{marginTop: '0.4rem'}}>
                            <button className="btn btn-outline-primary" onClick={addNewChapter}>Add chapter</button>
                        </div>
                        <div className="col mx-auto">

                        </div>
                        
                    </div>
                    <div id="chapters">
                        {chapterAccordions && chapterAccordions.forEach(element => {
                            element
                        })}
                        {/* <div className="accordion" id="chapterOne" style={{width: '40rem'}}>
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="headingOne">
                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                                        Глава 1: <input 
                                                className="form-control " 
                                                id="chapterTitle" 
                                                name="chapterTitle"
                                                type="text"
                                                placeholder="Title" 
                                                style={{width: '18rem'}} 
                                                // required={true}
                                                // onChange={changeHandler}                                
                                                ></input>
                                    </button>
                                </h2>
                                <div id="collapseOne" className="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#chaptersAccordion">
                                    <div className="accordion-body">
                                        <textarea className="form-control" type="text" style={{width: '40rem', marginLeft: '-1.4rem', marginTop: '-1rem', marginBottom: '-1rem'}}>

                                        </textarea>
                                </div>
                            </div>
                            </div>
                            
                        </div>
                        <div className="accordion" id="chapterTwo" style={{width: '40rem'}}>
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="headingTwo">
                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                        Глава 2: <input 
                                                className="form-control " 
                                                id="chapterTitle" 
                                                name="chapterTitle"
                                                type="text"
                                                placeholder="Title" 
                                                style={{width: '18rem'}} 
                                                // required={true}
                                                // onChange={changeHandler}                                
                                                ></input>
                                    </button>
                                </h2>
                                <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#chaptersAccordion">
                                    <div className="accordion-body">
                                        <textarea className="form-control" type="text" style={{width: '40rem', marginLeft: '-1.4rem', marginTop: '-1rem', marginBottom: '-1rem'}}>

                                        </textarea>
                                </div>
                            </div>
                            </div>
                            
                        </div> */}
                    </div>
                    
                    <div className="container centeredElement">
                        
                    </div>                  
                    <div className="container mt-1" style={{textAlign: 'right'}}>
                        <button className="btn btn-outline-primary me-1" onClick={redirectToUserPage}>Cancel</button>
                        <button className="btn btn-primary" onClick={createHandler}>Create</button>
                    </div>
                </div>
            </div>
        </div>
    )
}