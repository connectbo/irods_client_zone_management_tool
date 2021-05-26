import React, { useEffect, useState } from 'react';
import Appbar from '../../components/Appbar';
import Sidebar from '../../components/Sidebar';
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
            dataMap.set("", ["tempZone"])

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
        <div className={classes.root}>
            <Appbar />
            <Sidebar menu_id="3" />
            <main className={classes.content}>
                <div className={classes.toolbar} />
                <div className={classes.main}>
                    {dataMap !== undefined && <Tree data={dataMap} children={childrenMap} />}
                </div>
            </main>
        </div>
    )
}

export default ResourceTreeView;