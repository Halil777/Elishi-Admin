import images from "./images"

const data = {
    user: {
        name: 'Elishi',
        img: images.avt,
        avatar:images.user,
        placeholder:images.placeholder
    },
    summary: [
        {
            title: 'Product adding',
            subtitle: 'Total adding today',
            value: '1.000',
            percent: 70
        },
        {
            title: 'Product Views',
            subtitle: 'Total views today',
            value: '3000',
            percent: 49
        },
        {
            title: 'Passive product',
            subtitle: 'Total',
            value: '678',
            percent: 38
        },
        {
            title: 'Application Visits',
            subtitle: 'Total visits today',
            value: '2345',
            percent: 55
        }
    ],
    revenueSummary: {
        title: 'Total Active Products',
        value: '678',
        chartData: {
            labels: ['May', 'Jun', 'July', 'Aug', 'May', 'Jun', 'July', 'Aug'],
            data: [300, 300, 280, 380, 200, 300, 280, 350]
        }
    },
    overall: [
        {
            value: '4',
            title: 'Banners'
        },
        {
            value: '9.876',
            title: 'Users'
        },
        {
            value: '1.234',
            title: 'Products'
        },
        {
            value: '15',
            title: 'Congratulations'
        }
    ],
    revenueByChannel: [
        {
            title: 'Product adding',
            value: 70
        },
        {
            title: 'Product Views',
            value: 40
        },
        {
            title: 'Clicks',
            value: 60
        },
        {
            title: 'Visits',
            value: 30
        }
    ],
    revenueByMonths: {
        labels: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
        data: [250, 200, 300, 280, 100, 220, 310, 190, 200, 120, 250, 350]
    }
}

export default data