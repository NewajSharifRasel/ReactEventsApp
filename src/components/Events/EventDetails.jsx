import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";

import Header from "../Header.jsx";
import { fetchEvent, deleteEvent, queryClient } from "../../util/http.js";
import LoadingIndicator from "../UI/LoadingIndicator.jsx";
import ErrorBlock from "../UI/ErrorBlock.jsx";
import { QueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Modal from "./../UI/Modal";

export default function EventDetails() {
  const [isDeleting, setIsDeleting] = useState(false);
  const params = useParams();
  const navigate = useNavigate();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["events", params.id],
    queryFn: ({ signal }) => fetchEvent({ signal, id: params.id }),
  });

  const { mutate, isPending: isPendingDelete } = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ["events"] });
      navigate("/events");
    },
  });

  function handleDelete() {
    mutate({ id: params.id });
  }

  function handleStartDelete() {
    setIsDeleting(true);
  }

  function handleStopDelete() {
    setIsDeleting(false);
  }

  let content;

  if (isPending) {
    content = <LoadingIndicator />;
  }
  if (isError) {
    content = (
      <ErrorBlock title="Failed to load event" message={error.info?.message} />
    );
  }
  if (data) {
    content = (
      <>
        {isDeleting && (
          <Modal>
            <h2>Are you sure?</h2>
            <p>Do you really want to delete this event?</p>
            <div>
              {isPendingDelete && <p>Deleting, Please wait...</p>}
              {!isPendingDelete && (
                <>
                  <button onClick={handleStopDelete} className="button-text">
                    Cancel
                  </button>
                  <button onClick={handleDelete} className="button">
                    Delete
                  </button>
                </>
              )}
            </div>
          </Modal>
        )}

        <header>
          <h1>{data.title}</h1>
          <nav>
            <button onClick={handleStartDelete}>Delete</button>
            <Link to="edit">Edit</Link>
          </nav>
        </header>
        <div id="event-details-content">
          <img src={`http://localhost:3000/${data.image}`} alt={data.title} />
          <div id="event-details-info">
            <div>
              <p id="event-details-location">{data.location}</p>
              <time dateTime={`Todo-DateT$Todo-Time`}>
                {data.date} @ {data.time}
              </time>
            </div>
            <p id="event-details-description">{data.description}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      <article id="event-details"> {content}</article>
    </>
  );
}
