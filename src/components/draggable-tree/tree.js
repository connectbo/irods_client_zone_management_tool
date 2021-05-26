import React, { useEffect, useState } from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';
import TreeView from '@material-ui/lab/TreeView';
import { StyledTreeItem } from './tree-item';
import { Button } from '@material-ui/core';
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

export const Tree = (props) => {
    let childrenMap = props.children;
    let dataMap = props.data;
    const [stagingMap, setStagingMap] = useState(new Map(childrenMap));
    const [currNode, setCurrNode] = useState();
    const [newParentNode, setNewParentNode] = useState();
    const [prevParentNode, setPrevParentNode] = useState();
    const [confirmDialog, setConfirmDialog] = useState(false);
    const [isRemoved, setIsRemoved] = useState(false);
    const [isAdded, setIsAdded] = useState(false);

    const dragndropController = async () => {
        console.log(prevParentNode)
        console.log(currNode)
        let stagedPrevParentList = stagingMap.get(prevParentNode[11]);
        for (let i = 0; i < stagedPrevParentList.length; i++) {
            if (stagedPrevParentList[i][11] == currNode[11]) {
                stagedPrevParentList.splice(i, 1);
            }
        }
        stagingMap.set(prevParentNode[11], stagedPrevParentList)
        let stagedNewParentList = stagingMap.has(newParentNode[11]) ? stagingMap.get(newParentNode[11]) : [];
        stagedNewParentList.push(currNode)
        stagingMap.set(newParentNode[11], stagedNewParentList);

        console.log(stagingMap);

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
        setConfirmDialog(false);
    }

    const renderTreeNode = (node) => {
        const nodeId = node[0] === 'tempZone' ? "" : node[11];

        const handleDragEnd = (e) => {
            if (node[0] === e.target.children[0].children[1].innerHTML) {
                setCurrNode(node);
                setPrevParentNode(dataMap.get(node[10]));
                setConfirmDialog(true);
            }
            console.log("Drag start " + node[0])
        }

        const handleDragOver = (e) => {
            e.preventDefault();
        }

        const handleDrop = (e) => {
            if (e.target.innerHTML === node[0]) {
                setNewParentNode(node);
            }
            console.log("Drop at " + node[0])
        };
        return (
            <StyledTreeItem
                nodeId={nodeId}
                label={node[0]}
                onDragEnd={e => handleDragEnd(e)}
                onDragOver={e => handleDragOver(e)}
                onDrop={(e) => handleDrop(e)}>
                {childrenMap.has(nodeId) && childrenMap.get(nodeId).map(children => renderTreeNode(children))}
            </StyledTreeItem>
        )
    }

    useEffect(() => {
        renderTreeNode(dataMap.get(""))
    },[stagingMap])

    return (
        <TreeView
            defaultExpanded={['1']}
            defaultCollapseIcon={<MinusSquare />}
            defaultExpandIcon={<PlusSquare />}
            defaultEndIcon={<CloseSquare />}
        >{renderTreeNode(dataMap.get(""))}<Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)}><DialogTitle>Are you sure to make the following changes? </DialogTitle><DialogContent><div>Current Resource Name: </div><hr /><div className="resource_tree_parent_info"><span>Remove Previous Parent: </span> {isRemoved ? <span className="green">Complete</span> : <span>Awaiting</span>}</div><div className="resource_tree_parent_info"><span>Add New Parent: </span>{isAdded ? <span className="green">Complete</span> : <span>Awaiting</span>}</div></DialogContent>{isAdded && isRemoved ? <span className="resource_tree_status">Refreshing your page...</span> : ""}<DialogActions><Button color="primary" onClick={dragndropController}>Yes</Button><Button color="secondary" onClick={() => setConfirmDialog(false)}>No</Button></DialogActions></Dialog></TreeView>
    )
}