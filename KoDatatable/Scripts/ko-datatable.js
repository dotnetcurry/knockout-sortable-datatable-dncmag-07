/// <reference path="knockout-2.2.1.js" />
/// <reference path="jquery-2.0.2.js" />
var viewModel = function ()
{
    $this = this;
    $this.currentPage = ko.observable();
    $this.pageSize = ko.observable(10);
    $this.currentPageIndex = ko.observable(0);
    $this.contacts = ko.observableArray();
    $this.sortType = "ascending";
    $this.currentColumn = ko.observable("");
    $this.iconType = ko.observable("");
    $this.currentPage = ko.computed(function ()
    {
        var pagesize = parseInt($this.pageSize(), 10),
        startIndex = pagesize * $this.currentPageIndex(),
        endIndex = startIndex + pagesize;
        return $this.contacts.slice(startIndex, endIndex);
    });
    $this.nextPage = function ()
    {
        if ((($this.currentPageIndex() + 1) * $this.pageSize()) < $this.contacts().length)
        {
            $this.currentPageIndex($this.currentPageIndex() + 1);
        }
        else
        {
            $this.currentPageIndex(0);
        }
    };
    $this.previousPage = function ()
    {
        if ($this.currentPageIndex() > 0)
        {
            $this.currentPageIndex($this.currentPageIndex() - 1);
        }
        else
        {
            $this.currentPageIndex((Math.ceil($this.contacts().length / $this.pageSize())) - 1);
        }
    };
    $this.sortTable = function (viewModel, e)
    {
        var orderProp = $(e.target).attr("data-column")
        $this.currentColumn(orderProp);
        $this.contacts.sort(function (left, right)
        {
            leftVal = left[orderProp];
            rightVal = right[orderProp];
            if ($this.sortType == "ascending")
            {
                return leftVal < rightVal ? 1 : -1;
            }
            else
            {
                return leftVal > rightVal ? 1 : -1;
            }
        });
        $this.sortType = ($this.sortType == "ascending") ? "descending" : "ascending";
        $this.iconType(($this.sortType == "ascending") ? "icon-chevron-up" : "icon-chevron-down");
    };
}

$(document).ready(function ()
{
    $.ajax({
        url: "/api/AddressBook",
        type: "GET"
    }).done(function (data)
    {
        var vm = new viewModel();
        vm.contacts(data);
        ko.applyBindings(vm);
    });
});