import React from 'react';
import { Bar } from 'react-chartjs-2'

export default class Chart extends React.Component {

    state = {
        chartData: {}
    };

    componentWillMount() {
        this.extractChartData();
    }
    
    extractChartData = () => {
        const data = {
            labels: [],
            datasets:[{
                label: this.props.poll.question,
                data: [],
                backgroundColor: "#3ee2a9",
                borderWidth: 1,
                borderColor: "#777",
                hoverBorderWidth: 3,
                hoverBorderWidthColor: "#000" 
            }]
        };
        const pollOptions = [...this.props.poll.options];

        for (let i = 0; i < pollOptions.length; i++) {
            data.labels.push(pollOptions[i].value);
            data.datasets[0].data.push(pollOptions[i].votes);
        }

        this.setState({ chartData: data });
    }

    render() {
        return(
            <div className="container">
                <Bar 
                    data={this.state.chartData}
                    width={10}
                    height={300}
                    options={{
                        maintainAspectRatio: false
                    }}
                />
            </div>
        );
    }
}