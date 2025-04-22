import React, { useContext, useEffect, useRef, useState } from 'react'
// import NoteItem from './NoteItem';
import { useNavigate } from "react-router-dom";
import articleContext from '../context/articles/articleContext';




const News = () => {
    const [note, setNote] = useState({ id: "", title: "", description: "", tag: "" });

    const context = useContext(articleContext);
    const { notes, setNotes, fetchNotes, editNote, totalNotes } = context;
    // console.log(notes);

    const navigate = useNavigate();

    // let newNotes = [];
    const ref = useRef(null);


    const refClose = useRef(null);

    useEffect(() => {
        if (localStorage.getItem("token")) {
            // fetchNotes();
        }
        else {
            navigate("/login");
        }
        // eslint-disable-next-line
    }, [])

    const updateNote = (current_note) => {
        ref.current.click();
        setNote({ id: current_note._id, title: current_note.title, description: current_note.description, tag: current_note.tag });
    }

    const onChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value })
    }

    const handleUpdate = () => {
        refClose.current.click();
        editNote(note.id, note.title, note.description, note.tag);
    }

    const handleAddHover = (action) => {
        const circle = document.getElementById("addLogo").children[0];
        const plus = document.getElementById("addLogo").children[1];

        if (action === "in") {
            circle.setAttribute("fill", "rgb(13, 110, 253)");
            plus.setAttribute("fill", "#ffffff");
        }

        else {
            circle.setAttribute("fill", "#00000000");
            plus.setAttribute("fill", "rgb(13, 110, 253)");
        }
    }

    const handeAddClick = () => {
        if (document.getElementById("notes").children.length === totalNotes + 1) {
            // eslint - disable - next - line
            notes.map((note) => {
                newNotes.push(note);
            });
            newNotes.push({ title: "", description: "", tag: "", _id: "newNote" });
            setNotes(newNotes);
        }
    }

    useEffect(() => {

        // const img = document.getElementById("add_n   ote_img");


        const index = notes.length;
        const addNoteButton = document.getElementById("addNoteButton");
        // const img = document.getElementById("add_note_img");

        if (index > 0) {

            // img.style.display = "none";  
            const notesEle = document.getElementById("notes");
            const lastNote = notesEle.children[index - 1].firstElementChild;
            const height = lastNote.offsetHeight;

            const lastEle = notesEle.children[index].firstElementChild;

            lastEle.style.maxHeight = height + "px";

            addNoteButton.children[0].style.height = 0.8 * height + "px";
        }

        else {
            // <img src={require("./add_notes.png")} style={{ width: "40vw", height: "40vh", marginLeft: "7%" }} alt="" id='add_note_img' />

            // addNoteButton.style.width = '10vw';
            // const Card = document.getElementsByClassName("card")[0];
            // Card.style.width = 'fit-content';

            // img.style.display = "block";

        }
    }, [notes]);

    return (
        <>
            <div className="container">
                
            </div>
        </>
    )
}

export default News;