{/* CONTAINER INFO */}
<div className="col-12">
  <div className="row align-items-center compact-row mb-3">
    <div className="col-sm-8 border-bottom pb-1 full-width-title">
      CONTAINER INFO
    </div>
  </div>

  {/* Delete Container Button */}
  <div className="row mt-3 mb-3">
    <div className="col-1"></div>
    <div className="col-2">
      <button
        type="button"
        className="MoveOnButtons"
        style={{ fontSize: "12px" }}
        onClick={deleteSelectedContainers}
      >
        DELETE CONTAINER
      </button>
    </div>
  </div>

  {/* Container Table */}
  <div className="row mb-3">
    <div className="col-11 form-check">
      <table id="ContainerTable" style={{ width: "100%" }}>
        <thead>
          <tr className="fontTable">
            <th>
              <input
                type="checkbox"
                checked={containers.length > 0 && containers.every(c => c.isChecked)}
                onChange={(e) =>
                  setContainers(prev =>
                    prev.map(c => ({ ...c, isChecked: e.target.checked }))
                  )
                }
              />
            </th>
            <th>EDIT</th>
            <th>DELETE</th>
            <th>S.NO</th>
            <th>CONTAINER NO</th>
            <th>SIZE / TYPE</th>
            <th>WEIGHT (TNE)</th>
            <th>SEAL NO</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {containers.map((container, index) => (
            <tr key={container.id}>
              {/* Row checkbox */}
              <td>
                <input
                  type="checkbox"
                  checked={container.isChecked || false}
                  onChange={(e) =>
                    setContainers(prev =>
                      prev.map(c =>
                        c.id === container.id ? { ...c, isChecked: e.target.checked } : c
                      )
                    )
                  }
                />
              </td>

              {/* Edit */}
              <td>
                <FaEdit
                  style={{ width: "20px", cursor: "pointer" }}
                  onClick={() =>
                    setContainers(prev =>
                      prev.map(c =>
                        c.id === container.id ? { ...c, isSaved: false } : c
                      )
                    )
                  }
                />
              </td>

              {/* Delete single */}
              <td>
                <FaTrash
                  style={{ width: "15px", cursor: "pointer" }}
                  onClick={() => deleteContainer(container, index)}
                />
              </td>

              {/* S.NO */}
              <td>
                <input
                  type="text"
                  value={index + 1}
                  disabled
                  className="inputStyle"
                  style={{ width: "50px" }}
                />
              </td>

              {/* Container No */}
              <td>
                <input
                  type="text"
                  className="inputStyle"
                  value={container.number}
                  onChange={(e) =>
                    setContainers(prev =>
                      prev.map(c =>
                        c.id === container.id ? { ...c, number: e.target.value } : c
                      )
                    )
                  }
                  disabled={container.isSaved}
                />
              </td>

              {/* Size / Type */}
              <td>
                <select
                  className="Dropdown HighLighty"
                  value={container.sizeType}
                  onChange={(e) =>
                    setContainers(prev =>
                      prev.map(c =>
                        c.id === container.id ? { ...c, sizeType: e.target.value } : c
                      )
                    )
                  }
                  disabled={container.isSaved}
                >
                  <option>--Select--</option>
                  {containerType.map((ct) => (
                    <option key={ct.Name} value={ct.Name}>
                      {ct.Name}
                    </option>
                  ))}
                </select>
              </td>

              {/* Weight */}
              <td>
                <input
                  type="number"
                  className="inputStyle"
                  value={container.weight}
                  onChange={(e) =>
                    setContainers(prev =>
                      prev.map(c =>
                        c.id === container.id ? { ...c, weight: e.target.value } : c
                      )
                    )
                  }
                  disabled={container.isSaved}
                />
              </td>

              {/* Seal */}
              <td>
                <input
                  type="text"
                  className="inputStyle"
                  value={container.seal}
                  onChange={(e) =>
                    setContainers(prev =>
                      prev.map(c =>
                        c.id === container.id ? { ...c, seal: e.target.value } : c
                      )
                    )
                  }
                  disabled={container.isSaved}
                />
              </td>

              {/* Save / Saved */}
              <td>
                {!container.isSaved ? (
                  <button
                    type="button"
                    className="ButtonClick SaveContainer"
                    onClick={() => saveContainer(container, index)}
                  >
                    Save
                  </button>
                ) : (
                  <span
                    className="ButtonClick SaveContainer"
                    style={{ cursor: "default" }}
                  >
                    Saved
                  </span>
                )}
              </td>

              {/* Add new container */}
              <td>
                <FaPlus
                  style={{ width: "30px", cursor: "pointer" }}
                  className="AddContainerBtn"
                  onClick={addContainer}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>