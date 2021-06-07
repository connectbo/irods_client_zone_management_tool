import React, { useState } from 'react';
import Appbar from '../../components/Appbar';
import Sidebar from '../../components/Sidebar';
import Logout from '../Logout';
import { makeStyles } from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import '../../App.css';
import ResourceListView from './ResourceListView';
import ListIcon from '@material-ui/icons/List';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import ResourceTreeView from './ResourceTreeView';

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
    },
    tabGroup: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
}));

function Resource() {
    const auth = localStorage.getItem('zmt-token');
    if (auth === null) {
        return <Logout />
    }
    const classes = useStyles();
    const [tab, setTab] = useState('list');

    return (
        <div className={classes.root}>
            <Appbar />
            <Sidebar menu_id="3" />
            <main className={classes.content}>
                <div className={classes.toolbar} />
                <div className={classes.main}>
                    <ToggleButtonGroup className={classes.tabGroup} size="small" value={tab}>
                        <ToggleButton value="list" aria-label="list" onClick={() => setTab('list')}><ListIcon />ListView</ToggleButton>
                        <ToggleButton value="tree" aria-label="tree" onClick={() => setTab('tree')}><AccountTreeIcon />TreeView</ToggleButton>
                    </ToggleButtonGroup>
                    {tab === 'list' ? <ResourceListView /> : <ResourceTreeView />}
                </div>
            </main>
        </div>
    );
}

export default Resource;