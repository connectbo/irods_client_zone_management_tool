import React, { useEffect, useState } from 'react';
import Logout from '../../views/Logout';
import { makeStyles } from '@material-ui/core';
import { useServer } from '../../contexts/ServerContext';
import { Tree } from '../../components/draggable-tree/tree';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(3),
    },
    main: {
        whiteSpace: "pre-wrap",
        fontSize: 20
    }
}))

function ResourceTreeView() {
    const auth = localStorage.getItem('zmt-token');
    if (auth === null) {
        return <Logout />
    }
    const classes = useStyles();
    const { zoneName, rescContext, loadResource } = useServer();
    const [childrenMap, setChildrenMap] = useState();
    const [dataMap, setDataMap] = useState();

    useEffect(() => {
        if (rescContext.total !== 0) {
            let childrenMap = new Map();
            let dataMap = new Map();
            let tempZoneData = ['tempZone'];
            for (let i = 0; i < 11; i++) {
                tempZoneData.push('')
            }
            dataMap.set("", tempZoneData)

            rescContext._embedded.forEach(resc => {
                dataMap.set(resc[11], resc);
                if (!childrenMap.has(resc[10])) {
                    childrenMap.set(resc[10], []);
                }
                let childrens = childrenMap.get(resc[10]);
                childrens.push(resc);
                childrenMap.set(resc[10], childrens);
            })
            setChildrenMap(childrenMap);
            setDataMap(dataMap);
        }
    }, [rescContext])

    return (
        <div>
            {dataMap !== undefined && <Tree data={dataMap} children={childrenMap} />}
        </div>
    )
}

export default ResourceTreeView;