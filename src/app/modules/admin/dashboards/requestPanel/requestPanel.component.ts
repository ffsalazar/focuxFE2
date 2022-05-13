import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApexOptions } from 'ng-apexcharts';
import { RequestPanelService } from 'app/modules/admin/dashboards/RequestPanel/RequestPanel.service';
import { PieCharts,ColumnCharts } from './requestPanel.types';

@Component({
    selector       : 'project',
    templateUrl    : './requestPanel.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequestPanelComponent implements OnInit, OnDestroy
{
    chartGithubIssues: ApexOptions = {};
    chartTaskDistribution: ApexOptions = {};
    chartBudgetDistribution: ApexOptions = {};
    chartWeeklyExpenses: ApexOptions = {};
    chartMonthlyExpenses: ApexOptions = {};
    chartYearlyExpenses: ApexOptions = {};
    chartNewVsReturning: ApexOptions;
    chartGender: ApexOptions;
    chartAge: ApexOptions;
    chartLanguage: ApexOptions;
    chartRequests: ApexOptions = {};
    data: any;
    requestsByDepartment: PieCharts;
    requestsByArea: PieCharts;
    requestsByBusiness: ColumnCharts;

    selectedProject: string = 'Portafolio';
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _requestPanelService: RequestPanelService,
        private _router: Router
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Get the data
        this._requestPanelService.data$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {

                // Store the data
                this.data = data;
                // Prepare the chart data
                //this._prepareChartData();
            });

        // Attach SVG fill fixer to all ApexCharts
        window['Apex'] = {
            chart: {
                events: {
                    mounted: (chart: any, options?: any): void => {
                        this._fixSvgFill(chart.el);
                    },
                    updated: (chart: any, options?: any): void => {
                        this._fixSvgFill(chart.el);
                    }
                }
            }
        };

        this._requestPanelService.getRequestsByDepartment()
            .pipe(
            takeUntil(this._unsubscribeAll))
            .subscribe((data) => {
                this.requestsByDepartment = data;

                this._requestPanelService.getRequestsByArea()
                    .pipe(
                    takeUntil(this._unsubscribeAll))
                    .subscribe((byArea) => {
                        this.requestsByArea = byArea;

                        this._prepareChartData();
                    });
            });

        this._requestPanelService.getRequestsByBusiness()
            .pipe(
            takeUntil(this._unsubscribeAll))
            .subscribe((data) => {
                console.log(data);
                this.requestsByBusiness = data;

                this._prepareChartData();
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Fix the SVG fill references. This fix must be applied to all ApexCharts
     * charts in order to fix 'black color on gradient fills on certain browsers'
     * issue caused by the '<base>' tag.
     *
     * Fix based on https://gist.github.com/Kamshak/c84cdc175209d1a30f711abd6a81d472
     *
     * @param element
     * @private
     */
    private _fixSvgFill(element: Element): void
    {
        // Current URL
        const currentURL = this._router.url;

        // 1. Find all elements with 'fill' attribute within the element
        // 2. Filter out the ones that doesn't have cross reference so we only left with the ones that use the 'url(#id)' syntax
        // 3. Insert the 'currentURL' at the front of the 'fill' attribute value
        Array.from(element.querySelectorAll('*[fill]'))
             .filter(el => el.getAttribute('fill').indexOf('url(') !== -1)
             .forEach((el) => {
                 const attrVal = el.getAttribute('fill');
                 el.setAttribute('fill', `url(${currentURL}${attrVal.slice(attrVal.indexOf('#'))}`);
             });
    }

    /**
     * Prepare the chart data from the data
     *
     * @private
     */
    private _prepareChartData(): void
    {
        // Github issues
        this.chartGithubIssues = {
            chart      : {
                fontFamily: 'inherit',
                foreColor : 'inherit',
                height    : '100%',
                type      : 'line',
                toolbar   : {
                    show: false
                },
                zoom      : {
                    enabled: false
                }
            },
            colors     : ['#64748B', '#94A3B8'],
            dataLabels : {
                enabled        : true,
                enabledOnSeries: [0],
                background     : {
                    borderWidth: 0
                }
            },
            grid       : {
                borderColor: 'var(--fuse-border)'
            },
            labels     : this.data.githubIssues.labels,
            legend     : {
                show: false
            },
            plotOptions: {
                bar: {
                    columnWidth: '50%'
                }
            },
            series     : this.data.githubIssues.series,
            states     : {
                hover: {
                    filter: {
                        type : 'darken',
                        value: 0.75
                    }
                }
            },
            stroke     : {
                width: [3, 0]
            },
            tooltip    : {
                followCursor: true,
                theme       : 'dark'
            },
            xaxis      : {
                axisBorder: {
                    show: false
                },
                axisTicks : {
                    color: 'var(--fuse-border)'
                },
                labels    : {
                    style: {
                        colors: 'var(--fuse-text-secondary)'
                    }
                },
                tooltip   : {
                    enabled: false
                }
            },
            yaxis      : {
                labels: {
                    offsetX: -16,
                    style  : {
                        colors: 'var(--fuse-text-secondary)'
                    }
                }
            }
        };

        // Task distribution
        this.chartTaskDistribution = {
            chart      : {
                fontFamily: 'inherit',
                foreColor : 'inherit',
                height    : '100%',
                type      : 'polarArea',
                toolbar   : {
                    show: false
                },
                zoom      : {
                    enabled: false
                }
            },
            labels     : this.data.taskDistribution.labels,
            legend     : {
                position: 'bottom'
            },
            plotOptions: {
                polarArea: {
                    spokes: {
                        connectorColors: 'var(--fuse-border)'
                    },
                    rings : {
                        strokeColor: 'var(--fuse-border)'
                    }
                }
            },
            series     : this.data.taskDistribution.series,
            states     : {
                hover: {
                    filter: {
                        type : 'darken',
                        value: 0.75
                    }
                }
            },
            stroke     : {
                width: 2
            },
            theme      : {
                monochrome: {
                    enabled       : true,
                    color         : '#93C5FD',
                    shadeIntensity: 0.75,
                    shadeTo       : 'dark'
                }
            },
            tooltip    : {
                followCursor: true,
                theme       : 'dark'
            },
            yaxis      : {
                labels: {
                    style: {
                        colors: 'var(--fuse-text-secondary)'
                    }
                }
            }
        };

        // Budget distribution
        this.chartBudgetDistribution = {
            chart      : {
                fontFamily: 'inherit',
                foreColor : 'inherit',
                height    : '100%',
                type      : 'radar',
                sparkline : {
                    enabled: true
                }
            },
            colors     : ['#818CF8'],
            dataLabels : {
                enabled   : true,
                formatter : (val: number): string | number => `${val}%`,
                textAnchor: 'start',
                style     : {
                    fontSize  : '13px',
                    fontWeight: 500
                },
                background: {
                    borderWidth: 0,
                    padding    : 4
                },
                offsetY   : -15
            },
            markers    : {
                strokeColors: '#818CF8',
                strokeWidth : 4
            },
            plotOptions: {
                radar: {
                    polygons: {
                        strokeColors   : 'var(--fuse-border)',
                        connectorColors: 'var(--fuse-border)'
                    }
                }
            },
            series     : this.data.budgetDistribution.series,
            stroke     : {
                width: 2
            },
            tooltip    : {
                theme: 'dark',
                y    : {
                    formatter: (val: number): string => `${val}%`
                }
            },
            xaxis      : {
                labels    : {
                    show : true,
                    style: {
                        fontSize  : '12px',
                        fontWeight: '500'
                    }
                },
                categories: this.data.budgetDistribution.categories
            },
            yaxis      : {
                max       : (max: number): number => parseInt((max + 10).toFixed(0), 10),
                tickAmount: 7
            }
        };

        // Weekly expenses
        this.chartWeeklyExpenses = {
            chart  : {
                animations: {
                    enabled: false
                },
                fontFamily: 'inherit',
                foreColor : 'inherit',
                height    : '100%',
                type      : 'line',
                sparkline : {
                    enabled: true
                }
            },
            colors : ['#22D3EE'],
            series : this.data.weeklyExpenses.series,
            stroke : {
                curve: 'smooth'
            },
            tooltip: {
                theme: 'dark'
            },
            xaxis  : {
                type      : 'category',
                categories: this.data.weeklyExpenses.labels
            },
            yaxis  : {
                labels: {
                    formatter: (val): string => `$${val}`
                }
            }
        };

        // Monthly expenses
        this.chartMonthlyExpenses = {
            chart  : {
                animations: {
                    enabled: false
                },
                fontFamily: 'inherit',
                foreColor : 'inherit',
                height    : '100%',
                type      : 'line',
                sparkline : {
                    enabled: true
                }
            },
            colors : ['#4ADE80'],
            series : this.data.monthlyExpenses.series,
            stroke : {
                curve: 'smooth'
            },
            tooltip: {
                theme: 'dark'
            },
            xaxis  : {
                type      : 'category',
                categories: this.data.monthlyExpenses.labels
            },
            yaxis  : {
                labels: {
                    formatter: (val): string => `$${val}`
                }
            }
        };

        // Yearly expenses
        this.chartYearlyExpenses = {
            chart  : {
                animations: {
                    enabled: false
                },
                fontFamily: 'inherit',
                foreColor : 'inherit',
                height    : '100%',
                type      : 'line',
                sparkline : {
                    enabled: true
                }
            },
            colors : ['#FB7185'],
            series : this.data.yearlyExpenses.series,
            stroke : {
                curve: 'smooth'
            },
            tooltip: {
                theme: 'dark'
            },
            xaxis  : {
                type      : 'category',
                categories: this.data.yearlyExpenses.labels
            },
            yaxis  : {
                labels: {
                    formatter: (val): string => `$${val}`
                }
            }
        };
        // Distribución por departamento
        this.chartNewVsReturning = {
            chart      : {
                animations: {
                    speed           : 400,
                    animateGradually: {
                        enabled: false
                    }
                },
                fontFamily: 'inherit',
                foreColor : 'inherit',
                height    : '100%',
                type      : 'donut',
                sparkline : {
                    enabled: true
                }
            },
            colors     : ['#3182CE', '#63B3ED', '#63B43B', '#638988', '#B23412'],
            labels     : this.requestsByDepartment.labels,
            plotOptions: {
                pie: {
                    customScale  : 1,
                    expandOnClick: false,
                    donut        : {
                        size: '60%'
                    }
                }
            },
            series     : this.requestsByDepartment.series,
            states     : {
                hover : {
                    filter: {
                        type: 'none'
                    }
                },
                active: {
                    filter: {
                        type: 'none'
                    }
                }
            },
            tooltip    : {
                enabled        : true,
                fillSeriesColor: false,
                theme          : 'dark',
                custom         : ({
                                      seriesIndex,
                                      w
                                  }): string => `<div class="flex items-center h-8 min-h-8 max-h-8 px-3">
                                                    <div class="w-3 h-3 rounded-full" style="background-color: ${w.config.colors[seriesIndex]};"></div>
                                                    <div class="ml-2 text-md leading-none">${w.config.labels[seriesIndex]}:</div>
                                                    <div class="ml-2 text-md font-bold leading-none">${w.config.series[seriesIndex]}%</div>
                                                </div>`
            }
        };

        // Distribución por area comercial
        this.chartGender = {
            chart      : {
                animations: {
                    speed           : 400,
                    animateGradually: {
                        enabled: false
                    }
                },
                
                fontFamily: 'inherit',
                foreColor : 'inherit',
                height    : '100%',
                type      : 'donut',
                sparkline : {
                    enabled: true
                }
            },
              legend: {
              position: 'bottom',
              offsetX: -10,
              offsetY: 0
            },
            colors     : ['#319795', '#4FD1C5', '#526266', '#282'],
            labels     : this.requestsByArea.labels,
            plotOptions: {
                pie: {
                    customScale  : 0.9,
                    expandOnClick: false,
                    donut        : {
                        size: '60%'
                    }
                }
            },
            series     : this.requestsByArea.series,
            states     : {
                hover : {
                    filter: {
                        type: 'none'
                    }
                },
                active: {
                    filter: {
                        type: 'none'
                    }
                }
            },
            tooltip    : {
                enabled        : true,
                fillSeriesColor: false,
                theme          : 'dark',
                custom         : ({
                                      seriesIndex,
                                      w
                                  }): string => `<div class="flex items-center h-8 min-h-8 max-h-8 px-3">
                                                     <div class="w-3 h-3 rounded-full" style="background-color: ${w.config.colors[seriesIndex]};"></div>
                                                     <div class="ml-2 text-md leading-none">${w.config.labels[seriesIndex]}:</div>
                                                     <div class="ml-2 text-md font-bold leading-none">${w.config.series[seriesIndex]}%</div>
                                                 </div>`
            }
        };


        //Activas y finalizadas por mes
 var options = {
        
        };

           this.chartRequests = {
            chart  : {
                animations: {
                    enabled: false
                },
                fontFamily: 'inherit',
                foreColor : 'inherit',
                height    : '400px',
                width     : '400px',
                type      : 'bar',
                stacked : true
            },
             responsive: [{
             breakpoint: 480,
        }],
           plotOptions: {
            bar: {
                horizontal: false,
                borderRadius: 8
            },
            },
            colors : ['gray', '#234234','#f77333', 'lightblue'],
            series : this.requestsByBusiness.series,
             labels: this.requestsByBusiness.categories,
            stroke : {
                curve: 'smooth'
            },
           
            xaxis  : {
               
            },
            yaxis  : {
               
            },
            
        };
    }
}
