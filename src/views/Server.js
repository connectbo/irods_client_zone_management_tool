import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Logout from './Logout';
import Appbar from '../components/Appbar';
import Sidebar from '../components/Sidebar';
import { useServer } from '../contexts/ServerContext';
import { makeStyles, Typography } from '@material-ui/core';
import { Button, FormControl, InputLabel, Select } from '@material-ui/core';
import { Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import { Box, Paper, Tab, Tabs } from '@material-ui/core';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';


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
    pagination: {
        display: 'flex',
        flexDirection: 'row',
        margin: theme.spacing(1),
        justifyContent: 'center'
    },
    pagination_item: {
        transitionDuration: '1.5s'
    },
    itemsControl: {
        marginLeft: 30,
        minWidth: 120
    },
    tab_panel: {
        width: 700,
    },
    info: {
        margin: theme.spacing(1),
        fontSize: 14
    },
    plugin_info: {
        fontSize: 14
    },
    server: {
        width: theme.spacing(8)
    },
    server_card: {
        width: theme.spacing(40),
    },
    server_details: {
        flexGrow: 1,
        display: 'flex',
        height: 600,
        padding: 0
    },
    tabs: {
        width: 250,
    },
    tab: {
        marginTop: 20,
        textTransform: 'none',
        fontSize: 15
    }
}))

function Server() {
    const auth = localStorage.getItem('zmt-token');
    if (auth === null) {
        return <Logout />
    }
    const classes = useStyles();
    const { zoneContext, filteredServers, loadCurrServer } = useServer();
    const [currPage, setCurrPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [tabValue, setTabValue] = useState(0);
    const [openDetails, setOpenDetails] = useState(false);
    const [currServer, setCurrServer] = useState();
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("role");

    useEffect(() => {
        loadCurrServer(perPage * (currPage - 1), perPage * currPage, order, orderBy);
    }, [perPage, currPage, order, orderBy])

    const handleSort = props => {
        const isAsc = orderBy === props && order === 'desc';
        setOrder(isAsc ? 'asc' : 'desc');
        setOrderBy(props);
    }

    function TabPanel(props) {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`vertical-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box p={1}>
                        <Typography>{children}</Typography>
                    </Box>
                )}
            </div>
        );
    }

    TabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.any.isRequired,
        value: PropTypes.any.isRequired,
    };

    function a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    return (
        <div className={classes.root}>
            <Appbar />
            <Sidebar menu_id="2" />
            <main className={classes.content}>
                <div className={classes.toolbar} />
                {zoneContext === undefined ? <div /> :
                    <div className={classes.main}>
                        <div className={classes.pagination}>
                            <Pagination className={classes.pagination_item} count={Math.ceil(zoneContext.length / perPage)} onChange={(e) => setCurrPage(e.target.value)} />
                            <FormControl className={classes.itemsControl}>
                                <InputLabel htmlFor="items-per-page">Items Per Page</InputLabel>
                                <Select
                                    native
                                    id="items-per-page"
                                    label="Items Per Page"
                                    onChange={(event) => { setPerPage(event.target.value); setCurrPage(1); }}
                                >
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                </Select>
                            </FormControl>
                        </div>
                        <TableContainer className={classes.tableContainer} component={Paper}>
                            <Table className={classes.table} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ fontSize: '1.1rem', width: '25%' }}><b>Role</b><TableSortLabel active={orderBy === "role"} direction={orderBy === "role" ? order : 'asc'} onClick={() => { handleSort("role") }} /></TableCell>
                                        <TableCell style={{ fontSize: '1.1rem', width: '25%' }} ><b>Hostname</b><TableSortLabel active={orderBy === "hostname"} direction={orderBy === "hostname" ? order : 'asc'} onClick={() => { handleSort("hostname") }} /></TableCell>
                                        <TableCell style={{ fontSize: '1.1rem', width: '20%' }}><b>Resources</b><TableSortLabel active={orderBy === "resources"} direction={orderBy === "resources" ? order : 'asc'} onClick={() => { handleSort("resources") }} /></TableCell>
                                        <TableCell style={{ fontSize: '1.1rem', width: '20%' }}><b>OS Distribution</b><TableSortLabel active={orderBy === "os"} direction={orderBy === "os" ? order : 'asc'} onClick={() => { handleSort("os") }} /></TableCell>
                                        <TableCell style={{ fontSize: '1.1rem', width: '10%' }} align="right"></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredServers.map((server) =>
                                        <TableRow key={server['host_system_information']['hostname']}>
                                            <TableCell style={{ padding: 0, fontSize: '1.1rem', width: '25%' }}><div className="server_role_container"><div className={`server_${server['server_config']['catalog_service_role']}`} />{server['server_config']['catalog_service_role'] === 'provider' ? "Catalog Service Provider" : "Catalog Service Consumer"}</div></TableCell>
                                            <TableCell style={{ fontSize: '1.1rem', width: '25%' }}>{server['host_system_information']['hostname']}</TableCell>
                                            <TableCell style={{ fontSize: '1.1rem', width: '20%' }}>{server['resources']}</TableCell>
                                            <TableCell style={{ fontSize: '1.1rem', width: '20%' }}>{server['host_system_information']['os_distribution_name'] + " " + server['host_system_information']['os_distribution_version']}</TableCell>
                                            <TableCell style={{ fontSize: '1.1rem', width: '10%' }} align='right'><Button color="primary" onClick={() => { setCurrServer(server); setOpenDetails(true); }}>Details</Button></TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>{currServer !== undefined &&
                            <Dialog open={openDetails} className={classes.dialog} onClose={() => setOpenDetails(false)}>
                                <DialogTitle>Server Details</DialogTitle>
                                <DialogContent className={classes.server_details}>
                                    <Tabs orientation="vertical" variant="scrollable" value={tabValue} className={classes.tabs} onChange={(event, newValue) => setTabValue(newValue)} aria-label="vertical tabs example">
                                        <Tab className={classes.tab} label="General" {...a11yProps(0)} />
                                        <Tab className={classes.tab} label="Service Configuration" {...a11yProps(1)} />
                                        <Tab className={classes.tab} label="Service Account Environment" {...a11yProps(2)} />
                                        <Tab className={classes.tab} label={<React.Fragment><span>Plugin ({currServer['plugins'].length})</span></React.Fragment>} {...a11yProps(3)} />
                                    </Tabs>
                                    <TabPanel className={classes.tab_panel} value={tabValue} index={0}>
                                        <p className={classes.info}>Hostname: {currServer['host_system_information']['hostname']}</p>
                                        <p className={classes.info}>OS Distribution Name: {currServer['host_system_information']['os_distribution_name']}</p>
                                        <p className={classes.info}>OS Distribution Version: {currServer['host_system_information']['os_distribution_version']}</p>
                                        <p className={classes.info}>Service Account Group Name: {currServer['host_system_information']['service_account_group_name']}</p>
                                        <p className={classes.info}>Service Account User Name: {currServer['host_system_information']['service_account_user_name']}</p>
                                        <p className={classes.info}>Schema Name: {currServer['host_access_control_config']['schema_name']}</p>
                                        <p className={classes.info}>Schema Version: {currServer['host_access_control_config']['schema_version']}</p>
                                        <p className={classes.info}>Catalog Schema Version: {currServer['version']['catalog_schema_version']}</p>
                                        <p className={classes.info}>Configuration Schema Version: {currServer['version']['configuration_schema_version']}</p>
                                        <p className={classes.info}>iRODS Version: {currServer['version']['irods_version']}</p>
                                        <p className={classes.info}>Installation Time: {currServer['version']['installation_time']}</p>
                                    </TabPanel>
                                    <TabPanel className={classes.tab_panel} value={tabValue} index={1}>
                                        <div className={classes.info}>Catalog Provider Hosts: {currServer['server_config']['catalog_provider_hosts']}</div>
                                        <div className={classes.info}>Catalog Service Role: {currServer['server_config']['catalog_service_role']}</div>
                                        <div className={classes.info}>Client Api Whitelist Policy: {currServer['server_config']['client_api_whitelist_policy']}</div>
                                        <div className={classes.info}>Default Dir Mode: {currServer['server_config']['default_dir_mode']}</div>
                                        <div className={classes.info}>Default File Mode: {currServer['server_config']['default_file_mode']}</div>
                                        <div className={classes.info}>Default Hash Scheme: {currServer['server_config']['default_hash_scheme']}</div>
                                        <div className={classes.info}>Default Resource Name: {currServer['server_config']['default_resource_name']}</div>
                                        <div className={classes.info}>Match Hash Policy: {currServer['server_config']['match_hash_policy']}</div>
                                        <div className={classes.info}>Server Control Plane Encryption Algorithm: {currServer['server_config']['server_control_plane_encryption_algorithm']}</div>
                                        <div className={classes.info}>Server Control Plane Encryption Num Hash Rounds: {currServer['server_config']['server_control_plane_encryption_num_hash_rounds']}</div>
                                        <div className={classes.info}>Server Control Plane Port: {currServer['server_config']['server_control_plane_port']}</div>
                                        <div className={classes.info}>Server Port Range: {currServer['server_config']['server_port_range_start']} ~ {currServer['server_config']['server_port_range_end']}</div>
                                        <div className={classes.info}>XMSG Port: {currServer['server_config']['xmsg_port']}</div>
                                        <div className={classes.info}>Zone Auth Scheme: {currServer['server_config']['zone_auth_scheme']}</div>
                                        <div className={classes.info}>Zone Port: {currServer['server_config']['zone_port']}</div>
                                        <div className={classes.info}>Zone User: {currServer['server_config']['zone_user']}</div>
                                    </TabPanel>
                                    <TabPanel className={classes.tab_panel} value={tabValue} index={2}>
                                        <div className={classes.info}>iRODS Client Server Negotiation: {currServer['service_account_environment']['irods_client_server_negotiation']}</div>
                                        <div className={classes.info}>iRODS Client Server Policy: {currServer['service_account_environment']['irods_client_server_policy']}</div>
                                        <div className={classes.info}>iRODS Connection Refresh Time: {currServer['service_account_environment']['irods_connection_pool_refresh_time_in_seconds']}</div>
                                        <div className={classes.info}>iRODS CWD: {currServer['service_account_environment']['irods_cwd']}</div>
                                        <div className={classes.info}>iRODS Default Hash Scheme: {currServer['service_account_environment']['irods_default_hash_scheme']}</div>
                                        <div className={classes.info}>iRODS Default Resource: {currServer['service_account_environment']['irods_default_resource']}</div>
                                        <div className={classes.info}>iRODS Encryption Algorithm: {currServer['service_account_environment']['irods_encryption_algorithm']}</div>
                                        <div className={classes.info}>iRODS Encryption Key Size: {currServer['service_account_environment']['irods_encryption_key_size']}</div>
                                        <div className={classes.info}>iRODS Encryption Hash Rounds: {currServer['service_account_environment']['irods_encryption_num_hash_rounds']}</div>
                                        <div className={classes.info}>iRODS Encryption Salt Size: {currServer['service_account_environment']['irods_encryption_salt_size']}</div>
                                        <div className={classes.info}>iRODS Home: {currServer['service_account_environment']['irods_home']}</div>
                                        <div className={classes.info}>iRODS Maximum Size for Single Buffer In Megabytes: {currServer['service_account_environment']['irods_maximum_size_for_single_buffer_in_megabytes']}</div>
                                    </TabPanel>
                                    <TabPanel className={classes.tab_panel} value={tabValue} index={3}>
                                        <div>
                                            <tr><td><b>Name</b></td><td><b>Type</b></td></tr>
                                            {currServer['plugins'].map(plugin => <tr><td><div className={classes.plugin_info}>{plugin.name}</div></td><td><div className={classes.info}>{plugin.type}</div></td></tr>)}
                                        </div>
                                    </TabPanel>
                                </DialogContent>
                            </Dialog>
                        }
                    </div>
                }
            </main>
        </div>
    )
}

export default Server;