import { Settings,NotificationImportant,Map,LocationCity,PersonPin,Web,Event,PartyMode,PermMedia,Camera,Category, CategorySharp, Home, SubdirectoryArrowLeftSharp,Box, ProductionQuantityLimitsTwoTone, ShoppingBasket, VerifiedUser, PersonSharp} from "@mui/icons-material"

const sidebarNav = [
    {
        link: '/category',
        section: 'category',
        icon: <Category  color="action"/>,
        text: 'Category'
    },
    {
        link: '/subcategory',
        section: 'subcategory',
        icon: <SubdirectoryArrowLeftSharp  color="action"/>,
        text: 'Sub Category'
    },
    {
        link: '/products',
        section: 'products',
        icon: <ShoppingBasket  color="action"/>,
        text: 'Products'
    },
    {
        link: '/users',
        section: 'users',
        icon: <PersonSharp  color="action"/>,
        text: 'Users'
    },
    {
        link: '/banners',
        section: 'banners',
        icon: <Camera  color="action"/>,
        text: 'Banners'
    },
    {
        link: '/ads',
        section: 'ads',
        icon: <PermMedia  color="action"/>,
        text: 'Ads'
    },
    {
        link: '/event',
        section: 'event',
        icon: <Event  color="action"/>,
        text: 'Events'
    },
    {
        link: '/constants',
        section: 'constants',
        icon: <Web  color="action"/>,
        text: 'Constants'
    },
    {
        link: '/usertype',
        section: 'usertype',
        icon: <PersonPin  color="action"/>,
        text: 'User Types'
    },
    {
        link: '/regions',
        section: 'regions',
        icon: <LocationCity  color="action"/>,
        text: 'Regions'
    },
    {
        link: '/districts',
        section: 'districts',
        icon: <Map  color="action"/>,
        text: 'Districts'
    },
    {
        link: '/push',
        section: 'push',
        icon: <NotificationImportant  color="action"/>,
        text: 'Push notification'
    },
    {
        link: '/settings',
        section: 'settings',
        icon: <Settings  color="action"/>,
        text: 'Settings'
    }
]

export default sidebarNav