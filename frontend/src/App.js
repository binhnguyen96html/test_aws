import axios from 'axios';
import { useEffect, useState } from 'react';

function App() {
  const [details, setDetails] = useState({ details: [] });
  const [newData, setNewData] = useState({
    employee: '',
    department: '',
  });
  const [edited, setEdited] = useState(false);

  const [currentEdit, setCurrentEdit] = useState({
    id: null,
    employee: '',
    department: '',
  });

  useEffect(() => {
    let data;
    axios
      .get('http://localhost:8000')
      .then((res) => {
        data = res.data;
        setDetails({
          details: data,
        });
      })
      .catch((err) => {});

    // console.log(details)
  }, [details.details.length]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post('http://localhost:8000', newData, {
        headers: {
          // 'Content-Type': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .then((res) => console.log('data: ', res.data))
      .catch((err) => {});
    setDetails({ ...details, details: [...details.details, newData] });

    setEdited(false);
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:8000/${id}`)
      .then((res) => {
        console.log('delete successfully');
        setDetails({ ...details, details: [...details.details, newData] });
      })
      .catch((err) => console.error(err));
  };

  const handleEdit = (idd) => {
    setEdited(!edited);
    let newCurrentEdit = details.details.filter((el) => el.id === idd)[0];
    setCurrentEdit(newCurrentEdit);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    console.log('currentedit33', currentEdit);

    // if (currentEdit.id !== null) {
    axios
      .put(`http://localhost:8000/${currentEdit.id}/`, currentEdit, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .then((res) => {
        console.log('item updated successfully: ', res.data);

        setDetails((prevDetails) => ({
          ...prevDetails,
          details: prevDetails.details.map((el) =>
            el.id === currentEdit.id ? res.data : el
          ),
        }));
      })
      .catch((err) => console.error('error: ', err));
    // }

    setEdited(false);
  };

  return (
    <div className="App" style={{maxWidth: '100vw', maxHeight: '100vh'}}>
      <div>
        <h1>BB Tech Company</h1>
        <hr></hr>

        <div>
          {!edited ? (
            <form onSubmit={handleSubmit}>
              <label>Name: </label>
              <input
                value={newData.employee}
                onChange={(e) => {
                  setNewData({ ...newData, employee: e.target.value });
                }}
              />

              <label>Department: </label>
              <input
                value={newData.department}
                onChange={(e) => {
                  setNewData({ ...newData, department: e.target.value });
                }}
              />

              <button type="submit">Submit</button>
            </form>
          ) : (
            <>
              <h4>Edit form</h4>
              <form onSubmit={handleEditSubmit}>
                <label>Name: </label>
                <input
                  value={currentEdit.employee || ''}
                  onChange={(e) => {
                    setCurrentEdit({
                      ...currentEdit,
                      employee: e.target.value,
                    });
                  }}
                />

                <label>Department: </label>
                <input
                  value={currentEdit.department || ''}
                  onChange={(e) => {
                    setCurrentEdit({
                      ...currentEdit,
                      department: e.target.value,
                    });
                  }}
                />

                <button type="submit">Done edit</button>
              </form>
            </>
          )}
        </div>

        <hr />
        <div 
        style={{ display: 'flex',   flexWrap: 'wrap', }}
        >
          {details.details.map((output, id) => (
            <div key={id}>
              <div
                style={{
                  border: '1px solid black',
                  padding: '30px',
                  width: '100px',
                  margin: '0 0 0 100px',
                }}
              >
                <h2>{output.employee}</h2>
                <h3>{output.department}</h3>
                <p>id: {output.id}</p>
                <button onClick={() => handleDelete(output.id)}>Delete</button>
                <button onClick={() => handleEdit(output.id)}>Edit</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
