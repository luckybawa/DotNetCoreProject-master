using System.Collections.Generic;
using Core.Common.Extensions;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace DotNetCoreWebApp.ViewModels
{
    public abstract class BaseViewModel
    {
        public string SearchTerms { get; set; }
        public string SortCol { get; set; }

        public string SortDir { get; set; }
        public bool SearchTermsExist { get { return !SearchTerms.IsNullOrWhiteSpace(); } private set { } }

        public void ClearSearchTerms()
        {
            SearchTerms = string.Empty;
        }

        public List<SelectListItem> SortDirections
        {
            get
            {
                var list = new List<SelectListItem>();
                list.Add(new SelectListItem { Text = "Ascending", Value = "ASC" });
                list.Add(new SelectListItem { Text = "Descending", Value = "DESC" });
                return list;
            }
        }

        public virtual List<SelectListItem> SortColumns {get;set;} 
    }
}