import React, { useEffect, useState } from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';
import TreeView from '@material-ui/lab/TreeView';
import { StyledTreeItem } from './tree-item';
import { Badge, Button } from '@material-ui/core';
import UndoIcon from '@material-ui/icons/Undo'
import RedoIcon from '@material-ui/icons/Redo';
import ReplayIcon from '@material-ui/icons/Replay';
import SaveIcon from '@material-ui/icons/Save';
import LowPriorityIcon from '@material-ui/icons/LowPriority';
import axios from 'axios';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';

function MinusSquare(props) {
    return (
        <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
            {/* tslint:disable-next-line: max-line-length */}
            <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
        </SvgIcon>
    );
}

function PlusSquare(props) {
    return (
        <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
            {/* tslint:disable-next-line: max-line-length */}
            <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
        </SvgIcon>
    );
}

function CloseSquare(props) {
    return (
        <SvgIcon className="close" fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
            {/* tslint:disable-next-line: max-line-length */}
            <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
        </SvgIcon>
    );
}

function replacer(key, value) {
    if (value instanceof Map) {
        return {
            dataType: 'Map',
            value: Array.from(value.entries()), // or with spread: value: [...value]
        };
    } else {
        return value;
    }
}
function reviver(key, value) {
    if(typeof value === 'object' && value !== null) {
      if (value.dataType === 'Map') {
        return new Map(value.value);
      }
    }
    return value;
  }


export const Tree = (props) => {
    let childrenMap = props.children;
    let dataMap = props.data;
    let originalChildrenMap = JSON.stringify(childrenMap, replacer);
    let originalDataMap = JSON.stringify(dataMap, replacer);
    const [stagedChildrenMap, setStagedChildrenMap] = useState(JSON.parse(originalChildrenMap, reviver));
    const [stagedDataMap, setStagedDataMap] = useState(JSON.parse(originalDataMap, reviver));
    const [redo, setRedo] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [newParentNode, setNewParentNode] = useState();
    const [confirmDialog, setConfirmDialog] = useState(false);
    const [isRemoved, setIsRemoved] = useState(false);
    const [isAdded, setIsAdded] = useState(false);

    const dragndropController = async (curr, prev) => {
        let new_tasks = tasks;
        let currNode = curr;
        let prevParentNode = prev;
        console.log("moving " + currNode[11] + " prev parent " + prevParentNode[11] + " new parent " + newParentNode[11])

        updateParentID(currNode, newParentNode);

        removeChild(prevParentNode, currNode);

        addChild(newParentNode, currNode);

        new_tasks.push([currNode, prevParentNode, newParentNode]);

        // if (prevParentNode !== 'tempZone') {
        //     const rm_child_response = await axios({
        //         method: 'POST',
        //         url: `http://54.210.60.122:80/irods-rest/1.0.0/admin`,
        //         headers: {
        //             'Authorization': localStorage.getItem('zmt-token')
        //         },
        //         params: {
        //             action: 'rm',
        //             target: 'childfromresc',
        //             arg2: prevParentNode,
        //             arg3: currNode
        //         }
        //     });
        // }
        // setIsRemoved(true);
        // if (newParentNode !== 'tempZone') {
        //     const add_child_response = await axios({
        //         method: 'POST',
        //         url: `http://54.210.60.122:80/irods-rest/1.0.0/admin`,
        //         headers: {
        //             'Authorization': localStorage.getItem('zmt-token')
        //         },
        //         params: {
        //             action: 'add',
        //             target: 'childtoresc',
        //             arg2: newParentNode,
        //             arg3: currNode,
        //             arg4: 'add_child'
        //         }
        //     });
        // }
        // setIsAdded(true);
        // setTimeout(() => { window.location.reload() }, 1000);
        //setConfirmDialog(false);
    }

    const updateParentID = (node, parent) => {
        let new_stagedDataMap = new Map(stagedDataMap);
        node[10] = parent[11];
        new_stagedDataMap.set(node[11], node);
        setStagedDataMap(new_stagedDataMap);
    }

    const addChild = (parent, child) => {
        let new_stagedChildrenMap = new Map(stagedChildrenMap);
        let stagedNewParentList = stagedChildrenMap.has(parent[11]) ? stagedChildrenMap.get(parent[11]) : [];
        stagedNewParentList.push(child)
        new_stagedChildrenMap.set(parent[11], stagedNewParentList);
        setStagedChildrenMap(new_stagedChildrenMap);
    }

    const removeChild = (parent, child) => {
        let new_stagedChildrenMap = new Map(stagedChildrenMap);
        let stagedPrevParentList = stagedChildrenMap.get(parent[11]);
        for (let i = stagedPrevParentList.length - 1; i >= 0; i--) {
            if (stagedPrevParentList[i][11] == child[11]) {
                stagedPrevParentList.splice(i, 1);
            }
        }
        new_stagedChildrenMap.set(parent[11], stagedPrevParentList)
        setStagedChildrenMap(new_stagedChildrenMap);
    }

    const undoTask = () => {
        let lastTask = tasks[tasks.length - 1];
        addChild(lastTask[1], lastTask[0])
        removeChild(lastTask[2], lastTask[0]);
        setRedo([...redo, lastTask]);
        setTasks(tasks.filter((task, i) => i !== tasks.length - 1))
    }

    const redoTask = () => {
        let lastUndoTask = redo[redo.length - 1];
        addChild(lastUndoTask[2], lastUndoTask[0]);
        removeChild(lastUndoTask[1], lastUndoTask[0]);
        setTasks([...tasks, lastUndoTask]);
        setRedo(redo.filter(task => task !== lastUndoTask))
    }

    const resetTree = () => {
        setStagedDataMap(JSON.parse(originalDataMap, reviver));
        setStagedChildrenMap(JSON.parse(originalChildrenMap, reviver));
        setRedo([]);
        setTasks([]);
    }

    const renderTreeNode = (node) => {
        const nodeId = node[0] === 'tempZone' ? "" : node[11];

        const handleDragEnd = (e) => {
            if (newParentNode !== undefined && node[0] === e.target.children[0].children[1].innerHTML && node[11] !== newParentNode[11]) {
                // setCurrNode(node);
                // setPrevParentNode(dataMap.get(node[10]));
                dragndropController(node, stagedDataMap.get(node[10]));
                // setConfirmDialog(true);
                console.log("Drag start " + node[11])
            }
        }

        const handleDragOver = (e) => {
            e.preventDefault();
        }

        const handleDrop = (e) => {
            if (e.target.innerHTML === node[0]) {
                setNewParentNode(node);
                console.log("Drop at " + node[11])
            }
        }

        return (
            <StyledTreeItem
                nodeId={nodeId}
                label={node[0]}
                draggable={node[11] === '' ? false : true}
                onDragEnd={e => handleDragEnd(e)}
                onDragOver={e => handleDragOver(e)}
                onDrop={(e) => handleDrop(e)}>
                {stagedChildrenMap.has(nodeId) && stagedChildrenMap.get(nodeId).map(children => renderTreeNode(children))}
            </StyledTreeItem>
        )
    }

    useEffect(() => {
        renderTreeNode(stagedDataMap.get(""))
    }, [stagedChildrenMap])

    return (
        <div>
            <div className="resource_tree_header">
                <Button disabled={tasks.length === 0} startIcon={<UndoIcon />} onClick={undoTask}>Undo</Button>
                <Button disabled={redo.length === 0} startIcon={<RedoIcon />} onClick={redoTask}>Redo</Button>
                <Button startIcon={<ReplayIcon />} onClick={resetTree}>Reset</Button>
                <Button disabled={tasks.length === 0} startIcon={<SaveIcon />}>Save</Button>
            </div>
            <div className="resource_tree_container">
                <div className="resource_tree">
                    <TreeView
                        defaultExpanded={['1']}
                        defaultCollapseIcon={<MinusSquare />}
                        defaultExpandIcon={<PlusSquare />}
                        defaultEndIcon={<CloseSquare />}
                    >{renderTreeNode(stagedDataMap.get(""))}
                    </TreeView>
                </div>
                <div className="resource_tree_notifcations">
                    <h3>Staged Changes <Badge badgeContent={tasks.length} color="primary"><LowPriorityIcon /></Badge></h3>
                    <div>
                        {tasks.map(task => <div>
                            {task[0][0]} parent: {task[1][0]} -> {task[2][0]}
                        </div>)}
                    </div>
                    <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)}>
                        <DialogTitle>Are you sure to make the following changes? </DialogTitle>
                        <DialogContent><div>Current Resource Name: </div><hr /><div className="resource_tree_parent_info"><span>Remove Previous Parent: </span> {isRemoved ? <span className="green">Complete</span> : <span>Awaiting</span>}</div><div className="resource_tree_parent_info"><span>Add New Parent: </span>{isAdded ? <span className="green">Complete</span> : <span>Awaiting</span>}</div></DialogContent>
                        {isAdded && isRemoved ? <span className="resource_tree_status">Refreshing your page...</span> : ""}
                        <DialogActions><Button color="primary" onClick={dragndropController}>Yes</Button><Button color="secondary" onClick={() => setConfirmDialog(false)}>No</Button></DialogActions>
                    </Dialog>
                </div>
            </div>
        </div>
    )
}