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
    const [chapters, setChapters] = useState([])
    //const [ourChapters, setOurChapters] = useState([])
    const [form, setForm] = useState({
        title: "",
        author: auth.userId,
        date: null,
        //chapters: null
    });


    const addNewChapter = () =>{
        chapters.push({id: numberOfChapters, chapterTitle: "", chapterContent: "", order: 0, likes: 0})
        setChapters(chapters)
        setNumberOfChapters(chapters.length)
    }

    useEffect(()=>{
        console.log(numberOfChapters)
        console.log(chapters)
    }, [numberOfChapters])

    const redirectToUserPage = () => {
        history.push('/user')
    }

    const changeChapterHandler = (event) => {
            //console.log("changeChapterTitleHandler: " + event.target.name)
            var chapterId = event.target.name
            if(chapterId.includes("chapterTitle")){
                chapterId = chapterId.replace("chapterTitle", "")                    
                const chapter = chapters.find(chapter => chapter.id === (chapterId-1))
                chapter.chapterTitle = event.target.value                   
            }
            else if(chapterId.includes("chapterContent")){
                chapterId = chapterId.replace("chapterContent", "")
                const chapter = chapters.find(chapter => chapter.id === (chapterId-1))
                chapter.chapterContent = event.target.value  
            }
            //console.log(chapters)
    };

    const changeHandler = (event) => {
        setForm({ ...form, [event.target.name]: event.target.value });        
    };

    useEffect(() => {
        console.log('Error', error)
        message(error);
        clearError();
    }, [error, message, clearError]);

    const createHandler = async () => {
        try {
            const data_req = await request('/api/text/create', 'POST', {title: form.title, author: auth.userId, chapters: chapters}, {Authorization: `Bearer ${auth.token}`})
            console.log(data)
            message(data_req.message)
            if(data_req.message === 'Фанфик успешно создан')
                history.push('/user')
        } catch (e) {
            
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
                        {chapters && chapters.map((chapter,index) => {
                            return(
                                <div className="accordion" id={"chapter" + (index+1)} style={{width: '40rem'}}>
                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id={"heading" + (index+1)}>
                                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={"#collapse" + (index+1)} aria-expanded="false" aria-controls={"collapse" + (index+1)}>
                                                Глава {index+1}: <input 
                                                        className="form-control " 
                                                        id={"chapterTitle" + (index+1)}
                                                        name={"chapterTitle" + (index+1)}
                                                        type="text"
                                                        placeholder="Title" 
                                                        style={{width: '18rem', marginLeft: '1rem'}} 
                                                        // required={true}
                                                        onChange={changeChapterHandler}                                
                                                        ></input>
                                            </button>
                                        </h2>
                                        <div id={"collapse" + (index+1)} className="accordion-collapse collapse" aria-labelledby={"heading" + (index+1)} data-bs-parent={"#chaptersAccordion" + (index+1)}>
                                            <div className="accordion-body">
                                                <textarea 
                                                id={"chapterContent" + (index+1)} 
                                                name={"chapterContent" + (index+1)} 
                                                className="form-control" type="text" 
                                                onChange={changeChapterHandler} 
                                                style={{width: '40rem', marginLeft: '-1.4rem', marginTop: '-1rem', marginBottom: '-1rem'}}>
                                                </textarea>
                                            </div>
                                        </div>
                                    </div>                                
                                </div>
                            )
                        })}                        
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