using System.Collections.Generic;
using DotNetCoreWebAppModels.Models;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace DotNetCoreWebApp.ViewModels
{
    public class ArtistViewModel : BaseViewModel
    {
        public ArtistViewModel()
        {
            ArtistsList = new List<Artist>();
        }
        public IEnumerable<Artist> ArtistsList { get; set; }

        override public List<SelectListItem> SortColumns
        {
            get
            {
                var list = new List<SelectListItem>
                {
                    new SelectListItem {Text = "Artist Id", Value = "ArtistId"},
                    new SelectListItem {Text = "Artist name", Value = "Name"}
                };
                return list;
            }
        }

    }
}