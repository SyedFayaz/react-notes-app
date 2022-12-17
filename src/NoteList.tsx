import { useMemo, useState } from "react";
import { Button, Col, Form, Modal, Row, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import ReactSelect from "react-select";
import { Note, Tag } from "./App";
import { NoteCard } from "./NoteCard";

type NoteListProps = {
    availableTags: Tag[]
    notes: Note[]
    deleteTag: (id: string) => void
    updateTag: (id: string, label: string) => void
}

type EditTagsModalProps = {
    show: boolean,
    availableTags: Tag[]
    handleClose: () => void
    deleteTag: (id: string) => void
    updateTag: (id: string, label: string) => void
}

export function NoteList({ availableTags, notes, updateTag, deleteTag }: NoteListProps) {
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [title, setTitle] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredNotes = useMemo(() => {
        return notes.filter(note => {
            return (title === "" || note.title.toLowerCase().includes(title.toLocaleLowerCase()))
                && (selectedTags.length === 0 || selectedTags.every(tag => note.tags.some(noteTag => noteTag.id === tag.id)))
        })
    }, [title, selectedTags, notes])

    return (
        <>
            <Row className="align-items-center mb-4">
                <Col>
                    <h1>Notes</h1>
                </Col>
                <Col xs="auto">
                    <Stack gap={2} direction="horizontal">
                        <Link to="/new">
                            <Button variant="primary">Create</Button>
                        </Link>
                        <Button variant="outlined-secondary" onClick={() => setIsModalOpen(true)}>Edit Tags</Button>
                    </Stack>
                </Col>
            </Row>

            <Form>
                <Row>
                    <Col>
                        <Form.Group controlId="title">
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" value={title} onChange={e => setTitle(e.target.value)}></Form.Control>
                        </Form.Group>
                    </Col>

                    <Col>
                        <Form.Group controlId="tags">
                            <Form.Label>Tags</Form.Label>
                            <ReactSelect isMulti
                                value={
                                    selectedTags.map(tag => {
                                        return { label: tag.label, value: tag.id }
                                    })
                                }
                                options={
                                    availableTags.map(tag => {
                                        return { label: tag.label, value: tag.id }
                                    })}
                                onChange={
                                    tags => {
                                        setSelectedTags(tags.map(tag => {
                                            return { label: tag.label, id: tag.value }
                                        }))
                                    }
                                }
                            />
                        </Form.Group>
                    </Col>
                </Row>
            </Form>

            <Row xs={1} sm={2} lg={3} xl={4} className="g-3 mt-4">
                {
                    filteredNotes.map(note => (
                        <Col key={note.id}>
                            <NoteCard id={note.id} title={note.title} tags={note.tags} />
                        </Col>
                    ))
                }
            </Row>
            <EditTagsModal show={isModalOpen} handleClose={() => setIsModalOpen(false)} availableTags={availableTags}
                updateTag={updateTag} deleteTag={deleteTag}
            />
        </>
    )
}

function EditTagsModal({ availableTags, handleClose, show, updateTag, deleteTag }: EditTagsModalProps) {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Tags</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Stack gap={2}>
                        {
                            availableTags.map(tag => (
                                <Row key={tag.id}>
                                    <Col>
                                        <Form.Control type="text" value={tag.label} onChange={(e)=> updateTag(tag.id, e.target.value)}/>
                                    </Col>
                                    <Col xs="auto">
                                        <Button variant="outline-danger" onClick={()=> deleteTag(tag.id)}>&times;</Button>
                                    </Col>
                                </Row>
                            ))
                        }
                    </Stack>
                </Form>
            </Modal.Body>
        </Modal>
    )
}